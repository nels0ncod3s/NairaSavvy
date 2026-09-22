import { lookup } from "node:dns";
import { isIP } from "node:net";
import { Agent, request } from "undici";
import ipaddr from "ipaddr.js";
import robotsParser from "robots-parser";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { hash, itemSchema, type Item, type Source } from "./model";
const USER_AGENT = "NairaSavvyScout/1.0";
export function publicAddress(address: string) {
  try {
    return ipaddr.parse(address).range() === "unicast";
  } catch {
    return false;
  }
}
export function allowedUrl(value: string, hosts: string[]) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443") ||
    isIP(url.hostname) ||
    !hosts.includes(url.hostname.toLowerCase())
  )
    throw new Error("Source URL is not approved");
  url.hash = "";
  for (const key of [...url.searchParams.keys()])
    if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  return url;
}
// Validate the exact DNS answers used by the connection, not a separate preflight lookup.
const dispatcher = new Agent({
  connect: {
    lookup(host, options, callback) {
      lookup(host, { ...options, all: true }, (error, addresses) => {
        if (error) return callback(error, "", 4);
        if (
          !addresses.length ||
          addresses.some((a) => !publicAddress(a.address))
        )
          return callback(
            new Error("Non-public source address blocked"),
            "",
            4,
          );
        if (options.all) callback(null, addresses);
        else callback(null, addresses[0].address, addresses[0].family);
      });
    },
  },
});
async function download(
  url: URL,
  hosts: string[],
  depth = 0,
): Promise<{ status: number; text: string }> {
  if (depth > 3) throw new Error("Too many source redirects");
  allowedUrl(url.href, hosts);
  const response = await request(url, {
    dispatcher,
    headers: { "user-agent": USER_AGENT, "accept-encoding": "identity" },
    signal: AbortSignal.timeout(12000),
    headersTimeout: 12000,
    bodyTimeout: 12000,
  });
  if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
    response.body.destroy();
    const location = response.headers.location;
    if (typeof location !== "string") throw new Error("Invalid redirect");
    return download(
      allowedUrl(new URL(location, url).href, hosts),
      hosts,
      depth + 1,
    );
  }
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      response.body.destroy();
      throw new Error("Source exceeds 1 MB");
    }
    chunks.push(Buffer.from(chunk));
  }
  return {
    status: response.statusCode,
    text: Buffer.concat(chunks).toString("utf8"),
  };
}
export function clean(value: unknown, limit = 600) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  const $ = load(String(value));
  $("script,style,noscript,iframe").remove();
  return $.text().replace(/\s+/g, " ").trim().slice(0, limit);
}
function record(
  source: Source,
  title: unknown,
  link: unknown,
  excerpt: unknown,
  date: unknown,
): Item | null {
  try {
    if (typeof link !== "string" || !link.trim()) return null;
    const url = allowedUrl(new URL(link, source.url).href, source.hosts).href;
    const titleText = clean(title, 240);
    if (!titleText) return null;
    const timestamp = typeof date === "string" ? Date.parse(date) : NaN;
    // Keep excerpts short; Scout never stores or republishes a complete article.
    const excerptText = clean(excerpt).split(/\s+/).slice(0, 60).join(" ");
    return itemSchema.parse({
      fingerprint: hash(url),
      source: source.name,
      sourceUrl: source.url,
      url,
      title: titleText,
      excerpt: excerptText,
      publishedAt:
        Number.isFinite(timestamp) && timestamp <= Date.now() + 86400000
          ? new Date(timestamp).toISOString()
          : null,
      collectedAt: new Date().toISOString(),
    });
  } catch {
    return null;
  }
}
export function parseSource(source: Source, body: string): Item[] {
  const items: Item[] = [];
  if (source.kind === "rss") {
    if (/<!DOCTYPE|<!ENTITY/i.test(body))
      throw new Error("Feed entities are not supported");
    const parsed = new XMLParser({
      ignoreAttributes: false,
      processEntities: true,
    }).parse(body);
    const entries = parsed.rss?.channel?.item ?? parsed.feed?.entry ?? [];
    for (const row of (Array.isArray(entries) ? entries : [entries]).slice(
      0,
      50,
    )) {
      const links = Array.isArray(row.link) ? row.link : [row.link];
      const link = links.find(
        (v: unknown) =>
          typeof v === "string" ||
          (v &&
            typeof v === "object" &&
            (!("@_rel" in v) || v["@_rel"] === "alternate")),
      );
      const item = record(
        source,
        row.title?.["#text"] ?? row.title,
        typeof link === "string" ? link : link?.["@_href"],
        row.description ?? row.summary?.["#text"] ?? row.summary ?? "",
        row.pubDate ?? row.published ?? row.updated,
      );
      if (item) items.push(item);
    }
  } else {
    if (!source.itemSelector || !source.titleSelector || !source.linkSelector)
      throw new Error("HTML source needs selectors");
    const $ = load(body);
    $("script,style,noscript,iframe").remove();
    $(source.itemSelector)
      .slice(0, 50)
      .each((_, element) => {
        const row = $(element);
        const date = source.dateSelector ? row.find(source.dateSelector) : null;
        const item = record(
          source,
          row.find(source.titleSelector!).text(),
          row.find(source.linkSelector!).attr("href"),
          source.excerptSelector ? row.find(source.excerptSelector).text() : "",
          date?.attr("datetime") ?? date?.text(),
        );
        if (item) items.push(item);
      });
  }
  return [...new Map(items.map((item) => [item.fingerprint, item])).values()];
}
export async function collect(source: Source) {
  if (!source.enabled) return [];
  const url = allowedUrl(source.url, source.hosts);
  const robots = await download(new URL("/robots.txt", url), source.hosts);
  if (robots.status !== 404) {
    if (robots.status !== 200)
      throw new Error("Robots policy unavailable; source skipped");
    const policy = robotsParser(new URL("/robots.txt", url).href, robots.text);
    if (
      policy.isAllowed(url.href, USER_AGENT) === false ||
      (policy.getCrawlDelay(USER_AGENT) ?? 0) > 10
    )
      throw new Error("Source robots policy prevents collection");
    const delay = policy.getCrawlDelay(USER_AGENT) ?? 1;
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(1, delay) * 1000),
    );
  }
  const result = await download(url, source.hosts);
  if (result.status !== 200)
    throw new Error(`Source returned HTTP ${result.status}`);
  return parseSource(source, result.text);
}
