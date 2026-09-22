import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import {
  allowedUrl,
  publicAddress,
  parseSource,
} from "../src/lib/agents/scout";
import { draft, hash, sourceSchema } from "../src/lib/agents/model";
import { renderEdition, sendBatch } from "../src/lib/agents/sendy";
import { writeBrief } from "../src/lib/agents/writer";
const source = sourceSchema.parse({
  id: "sample",
  name: "Sample",
  url: "https://example.com/feed",
  hosts: ["example.com"],
  kind: "rss",
  enabled: true,
  permission: "Fixture only",
});
const xml =
  "<rss><channel><item><title>Inflation falls to 20%</title><link>https://example.com/story?utm_source=test</link><description>&lt;p&gt;Reported inflation was 20%.&lt;/p&gt;</description><pubDate>Tue, 01 Sep 2026 12:00:00 GMT</pubDate></item></channel></rss>";
const item = parseSource(source, xml)[0];
const id = "00000000-0000-4000-8000-000000000001";
test("Scout blocks private destinations, credentials, redirects off allowlist and entity expansion", () => {
  for (const address of [
    "127.0.0.1",
    "10.0.0.1",
    "169.254.169.254",
    "::1",
    "::ffff:127.0.0.1",
    "100.64.0.1",
  ])
    assert.equal(publicAddress(address), false);
  assert.equal(publicAddress("8.8.8.8"), true);
  for (const url of [
    "http://example.com",
    "https://evil.com",
    "https://user:pass@example.com",
    "https://example.com:444",
    "https://127.0.0.1",
  ])
    assert.throws(() => allowedUrl(url, source.hosts));
  assert.throws(() =>
    parseSource(
      source,
      '<!DOCTYPE rss [<!ENTITY e SYSTEM "file:///etc/passwd">]><rss/>',
    ),
  );
  assert.equal(item.url, "https://example.com/story");
  assert.equal(item.excerpt, "Reported inflation was 20%.");
  const twice = xml.replace(
    "</channel>",
    "<item><title>Duplicate</title><link>https://example.com/story</link></item></channel>",
  );
  assert.equal(parseSource(source, twice).length, 1);
});
test("Scout supports Atom and HTML and strips executable markup", () => {
  const atom =
    '<feed><entry><title>A savings update</title><link rel="alternate" href="https://example.com/a"/><summary>Useful data</summary></entry></feed>';
  assert.equal(parseSource(source, atom)[0].publishedAt, null);
  const html = {
    ...source,
    kind: "html" as const,
    itemSelector: "article",
    titleSelector: "h2",
    linkSelector: "a",
    excerptSelector: "p",
  };
  const rows = parseSource(
    html,
    '<article><h2>Rates <script>alert(1)</script></h2><a href="/b">Read</a><p>Reported update</p></article>',
  );
  assert.equal(rows.length, 1);
  // HTML title extraction never renders code; all public output is React text.
  assert.equal(rows[0].url, "https://example.com/b");
});
test("Bayo retains provenance and Sendy escapes untrusted text and includes one-click unsubscribe", () => {
  const content = draft(item);
  assert.equal(content.sourceUrl, item.url);
  assert.ok(content.flags.length);
  content.paragraphs = ['<script>alert("x")</script>'];
  const mail = renderEdition(
    { id, subject: "Update", stories: [{ id, content }] },
    "https://nairasavvy.example",
    "a".repeat(64),
  );
  assert.ok(!mail.html.includes("<script>"));
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.oneClick, /\/api\/newsletter\/leave\?token=/);
  assert.throws(() =>
    renderEdition(
      { id, subject: "Update", stories: [{ id, content }] },
      "http://example.com",
      "a".repeat(64),
    ),
  );
});
test("AI summaries reject invented numbers and keep source identity fixed", async () => {
  const original = { ...process.env };
  const originalFetch = global.fetch;
  process.env.BAYO_MODE = "ai";
  process.env.OPENAI_API_KEY = "fake";
  process.env.BAYO_MODEL = "test-model";
  let paragraph = "Inflation was reported at 20%.";
  global.fetch = async (input, init) => {
    assert.equal(String(input), "https://api.openai.com/v1/responses");
    const request = JSON.parse(String(init?.body));
    assert.equal(request.store, false);
    assert.equal(request.tools, undefined);
    return Response.json({
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                title: "Inflation update",
                category: "news",
                paragraphs: [paragraph],
                flags: [],
              }),
            },
          ],
        },
      ],
    });
  };
  try {
    const result = await writeBrief(item);
    assert.equal(result.sourceUrl, item.url);
    paragraph = "Inflation was 99%.";
    await assert.rejects(writeBrief(item), /unsupported numbers/);
  } finally {
    global.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in original)) delete process.env[key];
    Object.assign(process.env, original);
  }
});
test("Sendy remains paused without explicit enablement", async () => {
  const before = process.env.AGENTS_SEND_ENABLED;
  delete process.env.AGENTS_SEND_ENABLED;
  try {
    await assert.rejects(sendBatch(), /Sending paused/);
  } finally {
    if (before !== undefined) process.env.AGENTS_SEND_ENABLED = before;
  }
});
test("pipeline SQL protects drafts, CAS approval, queue uniqueness, concurrent claims and consent", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;",
    );
    await db.exec(readFileSync("src/lib/supabase/schema.sql", "utf8"));
    await db.exec(readFileSync("src/lib/supabase/upgrade.sql", "utf8"));
    await db.exec(
      readFileSync(
        "supabase/migrations/20260917072149_agent_pipeline.sql",
        "utf8",
      ),
    );
    for (const table of [
      "agent_items",
      "agent_drafts",
      "agent_editions",
      "agent_deliveries",
      "agent_runs",
      "agent_events",
    ]) {
      const r = await db.query<{ allowed: boolean }>(
        `SELECT has_table_privilege('anon','public.${table}','SELECT') AS allowed`,
      );
      assert.equal(r.rows[0].allowed, false);
    }
    const rls = await db.query<{ relrowsecurity: boolean }>(
      "SELECT relrowsecurity FROM pg_class WHERE relname LIKE 'agent_%' AND relkind='r'",
    );
    assert.ok(rls.rows.every((r) => r.relrowsecurity));
    await db.exec("SET ROLE service_role");
    await db.query("INSERT INTO agent_items(fingerprint,item) VALUES($1,$2)", [
      item.fingerprint,
      JSON.stringify(item),
    ]);
    assert.equal(
      (await db.query("SELECT * FROM agent_uncurated()")).rows.length,
      1,
    );
    const content = draft(item);
    const revision = hash(JSON.stringify(content));
    await db.query(
      "INSERT INTO agent_drafts(id,fingerprint,content,revision) VALUES($1,$2,$3,$4)",
      [id, item.fingerprint, JSON.stringify(content), revision],
    );
    assert.equal(
      (await db.query("SELECT * FROM agent_uncurated()")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("SELECT agent_publish($1,$2,$3)", [id, "wrong", "Editor"]),
    );
    await db.exec("SET ROLE anon");
    assert.equal(
      (await db.query("SELECT id,content FROM agent_briefings")).rows.length,
      0,
    );
    await assert.rejects(db.query("SELECT agent_claim()"));
    await db.exec("SET ROLE service_role");
    await db.query("SELECT agent_publish($1,$2,$3)", [id, revision, "Editor"]);
    await assert.rejects(
      db.query("SELECT agent_publish($1,$2,$3)", [id, revision, "Editor"]),
    );
    await db.exec("SET ROLE anon");
    assert.equal(
      (await db.query("SELECT id,content FROM agent_briefings")).rows.length,
      1,
    );
    await assert.rejects(db.query("SELECT reviewer FROM agent_briefings"));
    await db.exec("SET ROLE service_role");
    await db.query(
      "INSERT INTO agent_editions(id,subject,stories,reviewer) VALUES($1,$2,$3,$4)",
      [id, "News", JSON.stringify([{ id, content }]), "Editor"],
    );
    await db.exec(
      "INSERT INTO subscribers(email,active,confirmed) VALUES('yes@example.invalid',true,true),('also@example.invalid',true,true),('pending@example.invalid',false,false),('optout@example.invalid',false,true)",
    );
    await assert.rejects(
      db.query("UPDATE agent_editions SET subject='Changed' WHERE id=$1", [id]),
    );
    const queued = await db.query<{ n: number }>(
      "SELECT agent_queue($1) AS n",
      [id],
    );
    assert.equal(queued.rows[0].n, 2);
    assert.equal(
      (await db.query<{ n: number }>("SELECT agent_queue($1) AS n", [id]))
        .rows[0].n,
      0,
    );
    const jobs = await Promise.all([
      db.query<{
        id: string;
        unsubscribe_token: string;
        unsubscribe_hash: string;
      }>("SELECT * FROM agent_claim()"),
      db.query<{
        id: string;
        unsubscribe_token: string;
        unsubscribe_hash: string;
      }>("SELECT * FROM agent_claim()"),
    ]);
    assert.notEqual(jobs[0].rows[0].id, jobs[1].rows[0].id);
    assert.notEqual(
      jobs[0].rows[0].unsubscribe_token,
      jobs[1].rows[0].unsubscribe_token,
    );
    assert.equal(
      jobs[0].rows[0].unsubscribe_hash,
      hash(jobs[0].rows[0].unsubscribe_token),
    );
    assert.equal(
      (await db.query("SELECT * FROM agent_claim()")).rows.length,
      0,
    );
    await db.query("SELECT agent_unsubscribe($1)", [
      jobs[0].rows[0].unsubscribe_hash,
    ]);
    await db.query("SELECT agent_unsubscribe($1)", [
      jobs[0].rows[0].unsubscribe_hash,
    ]);
    const left = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM subscribers WHERE active AND confirmed",
    );
    assert.equal(left.rows[0].n, 1);
    await db.query("SELECT agent_suppress('test-email','event:test')");
    await db.query(
      "UPDATE agent_deliveries SET provider_id='test-email' WHERE id=$1",
      [jobs[1].rows[0].id],
    );
    await db.query("SELECT agent_suppress('test-email','event:test')");
    await db.query("SELECT agent_suppress('test-email','event:test')");
    assert.equal(
      (
        await db.query<{ n: number }>(
          "SELECT count(*)::int AS n FROM subscribers WHERE active AND confirmed",
        )
      ).rows[0].n,
      0,
    );
    assert.equal((await db.query("SELECT * FROM agent_events")).rows.length, 1);
  } finally {
    await db.close();
  }
});

test("Sendy checks fresh consent, records accepted mail, and never retries uncertain requests", async () => {
  const original = { ...process.env };
  const originalFetch = global.fetch;
  Object.assign(process.env, {
    AGENTS_SEND_ENABLED: "true",
    SENDBYTE_API_KEY: "sk_live_fake",
    SENDBYTE_FROM_EMAIL: "editor@example.invalid",
    NEXT_PUBLIC_SITE_URL: "https://example.invalid",
    NEXT_PUBLIC_SUPABASE_URL: "https://db.invalid",
    SUPABASE_SECRET_KEY: "fake",
  });
  let mode = "success";
  let claims = 0;
  let calls = 0;
  const updates: Record<string, unknown>[] = [];
  global.fetch = async (input, init) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (url.startsWith("https://api.sendbyte.africa/")) {
      calls++;
      assert.equal(body.idempotency_key, `edition:${id}`);
      assert.match(body.list_unsubscribe.url, /\/api\/newsletter\/leave/);
      if (mode === "uncertain")
        throw new Error("Network timeout after acceptance");
      return Response.json({ id: "provider-one", sandbox: false });
    }
    assert.ok(url.startsWith("https://db.invalid/"));
    if (url.includes("/rpc/agent_claim"))
      return Response.json(
        claims++ === 0
          ? [
              {
                id,
                edition_id: id,
                subscriber_id: id,
                unsubscribe_token: "a".repeat(64),
              },
            ]
          : [],
      );
    if (url.includes("/agent_editions"))
      return Response.json({
        id,
        subject: "News",
        stories: [{ id, content: draft(item) }],
      });
    if (url.includes("/subscribers"))
      return Response.json({
        email: "reader@example.invalid",
        active: mode !== "unsubscribed",
        confirmed: true,
      });
    if (init?.method === "PATCH") {
      updates.push(body);
      return new Response(null, { status: 204 });
    }
    return Response.json([]);
  };
  try {
    assert.equal((await sendBatch(2)).processed, 1);
    assert.equal(calls, 1);
    assert.equal(updates.at(-1)?.status, "queued");
    mode = "unsubscribed";
    claims = 0;
    assert.equal((await sendBatch(2)).processed, 0);
    assert.equal(calls, 1);
    assert.equal(updates.at(-1)?.status, "suppressed");
    mode = "uncertain";
    claims = 0;
    await assert.rejects(sendBatch(2), /needs reconciliation/);
    assert.equal(calls, 2);
    assert.equal(updates.at(-1)?.status, "uncertain");
  } finally {
    global.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in original)) delete process.env[key];
    Object.assign(process.env, original);
  }
});
