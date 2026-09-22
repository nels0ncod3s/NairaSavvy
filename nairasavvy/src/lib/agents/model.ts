import { createHash } from "node:crypto";
import { z } from "zod";
export const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  url: z.url(),
  hosts: z.array(z.string()).min(1),
  kind: z.enum(["rss", "html"]),
  enabled: z.boolean().default(false),
  permission: z.string().min(1),
  itemSelector: z.string().optional(),
  titleSelector: z.string().optional(),
  linkSelector: z.string().optional(),
  excerptSelector: z.string().optional(),
  dateSelector: z.string().optional(),
});
export type Source = z.infer<typeof sourceSchema>;
export const itemSchema = z.object({
  fingerprint: z.string().length(64),
  source: z.string(),
  sourceUrl: z.url(),
  url: z.url().refine((v) => v.startsWith("https://")),
  title: z.string().min(1).max(240),
  excerpt: z.string().max(600),
  publishedAt: z.iso.datetime().nullable(),
  collectedAt: z.iso.datetime(),
});
export type Item = z.infer<typeof itemSchema>;
export const briefSchema = z.object({
  title: z.string().min(5).max(240),
  category: z.enum(["news", "savings", "grow", "cut-costs", "fight-back"]),
  paragraphs: z.array(z.string().min(1).max(2000)).min(1).max(12),
  source: z.string().min(1).max(100),
  sourceUrl: z.url().refine((v) => v.startsWith("https://")),
  sourceDate: z.iso.datetime().nullable(),
  flags: z.array(z.string().max(200)).max(20),
});
export type Brief = z.infer<typeof briefSchema>;
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export function draft(item: Item): Brief {
  const title = item.title;
  const category = /savings|deposit|interest rate/i.test(title)
    ? "savings"
    : /invest|stock|equities/i.test(title)
      ? "grow"
      : /price|cost|inflation/i.test(title)
        ? "cut-costs"
        : "news";
  return briefSchema.parse({
    title,
    category,
    paragraphs: [
      `${item.source} published a report titled “${title}”.`,
      ...(item.excerpt ? [`Source excerpt: “${item.excerpt}”`] : []),
      "Read the original report for its full context. This is a source briefing, not personal financial advice.",
    ],
    source: item.source,
    sourceUrl: item.url,
    sourceDate: item.publishedAt,
    flags: [
      "Verify the original source, excerpt rights, accuracy and relevance before approving.",
      ...(!item.publishedAt ? ["Source publication date is missing."] : []),
      ...(/\d/.test(title + item.excerpt)
        ? [
            "Check all figures, units and effective dates against the original source.",
          ]
        : []),
    ],
  });
}
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
