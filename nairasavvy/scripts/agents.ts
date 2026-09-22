import { readFile, writeFile } from "node:fs/promises";
import { z } from "zod";
import { agentDb, check } from "../src/lib/agents/db";
import { sourceSchema, hash } from "../src/lib/agents/model";
import { collect } from "../src/lib/agents/scout";
import {
  curate,
  editDraft,
  publish,
  makeEdition,
} from "../src/lib/agents/bayo";
import { renderEdition, sendBatch, reconcile } from "../src/lib/agents/sendy";
const [command, ...args] = process.argv.slice(2);
const uuid = (v: string) => z.uuid().parse(v);
async function main() {
  if (command === "scout") {
    const sources = z
      .array(sourceSchema)
      .max(30)
      .parse(
        JSON.parse(await readFile(args[0] ?? "agents/sources.json", "utf8")),
      );
    const enabled = sources.filter((s) => s.enabled);
    if (!enabled.length)
      throw new Error(
        "No enabled sources. Review agents/sources.json and enable approved sources.",
      );
    const db = agentDb();
    let failures = 0;
    for (const source of enabled) {
      try {
        const items = await collect(source);
        if (items.length) {
          const r = await db.from("agent_items").upsert(
            items.map((item) => ({ fingerprint: item.fingerprint, item })),
            { onConflict: "fingerprint", ignoreDuplicates: true },
          );
          check(r.error);
        }
        const log = await db
          .from("agent_runs")
          .insert({
            agent: "scout",
            source: source.id,
            status: items.length ? "completed" : "empty",
            item_count: items.length,
          });
        check(log.error);
        console.log(JSON.stringify({ source: source.id, items: items.length }));
      } catch (error) {
        failures++;
        const detail =
          error instanceof Error ? error.message : "Collection failed";
        check(
          (
            await db
              .from("agent_runs")
              .insert({
                agent: "scout",
                source: source.id,
                status: "failed",
                detail: detail.slice(0, 300),
              })
          ).error,
        );
        console.error(`${source.id}: ${detail}`);
      }
    }
    if (failures) process.exitCode = 1;
    return;
  }
  if (command === "bayo") return curate();
  if (command === "list") {
    const r = await agentDb()
      .from("agent_drafts")
      .select("id,revision,status,content")
      .eq("status", "needs_review")
      .order("created_at")
      .limit(100);
    check(r.error);
    return r.data;
  }
  if (command === "export") {
    if (!args[1]) throw new Error("export <draft-id> <file.json>");
    const r = await agentDb()
      .from("agent_drafts")
      .select("id,revision,content")
      .eq("id", uuid(args[0]))
      .single();
    check(r.error);
    await writeFile(args[1], JSON.stringify(r.data, null, 2) + "\n", {
      flag: "wx",
    });
    return { file: args[1] };
  }
  if (command === "edit") {
    const file = JSON.parse(await readFile(args[0], "utf8"));
    const content = await editDraft(
      uuid(file.id),
      z.string().length(64).parse(file.revision),
      file.content,
    );
    return {
      id: file.id,
      revision: hash(JSON.stringify(content)),
      message: "Export again and inspect before publishing",
    };
  }
  if (command === "publish")
    return {
      id: await publish(
        uuid(args[0]),
        z.string().length(64).parse(args[1]),
        z.string().min(2).parse(args[2]),
      ),
    };
  if (command === "reject") {
    const r = await agentDb()
      .from("agent_drafts")
      .update({ status: "rejected" })
      .eq("id", uuid(args[0]))
      .eq("status", "needs_review")
      .select("id");
    check(r.error);
    return r.data;
  }
  if (command === "edition")
    return makeEdition(args.slice(2).map(uuid), args[0], args[1]);
  if (command === "preview") {
    if (!args[1]) throw new Error("preview <edition-id> <output.html>");
    const r = await agentDb()
      .from("agent_editions")
      .select("id,subject,stories")
      .eq("id", uuid(args[0]))
      .single();
    check(r.error);
    const mail = renderEdition(
      r.data,
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid",
      "0".repeat(64),
    );
    await writeFile(args[1], mail.html, { flag: "wx" });
    return {
      file: args[1],
      message: "Preview token is intentionally invalid; no email sent",
    };
  }
  if (command === "queue") {
    const r = await agentDb().rpc("agent_queue", { edition: uuid(args[0]) });
    check(r.error);
    return { queued: r.data };
  }
  if (command === "send")
    return sendBatch(
      z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .parse(args[0] ?? 20),
    );
  if (command === "reconcile") {
    await reconcile(z.string().min(1).parse(args[0]));
    return { reconciled: true };
  }
  if (command === "status") {
    const db = agentDb();
    const jobs = await db
      .from("agent_deliveries")
      .select("id,edition_id,status,provider_id,detail,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    check(jobs.error);
    const runs = await db
      .from("agent_runs")
      .select("agent,source,status,item_count,detail,created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    check(runs.error);
    return { deliveries: jobs.data, runs: runs.data };
  }
  throw new Error(
    "Commands: scout [sources.json], bayo, list, export <id> <file>, edit <file>, publish <id> <revision> <reviewer>, reject <id>, edition <subject> <reviewer> <brief-id>..., preview <edition-id> <file.html>, queue <edition-id>, send [1-100], reconcile <provider-id>, status",
  );
}
main()
  .then((result) => {
    if (result !== undefined) console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Agent command failed",
    );
    process.exitCode = 1;
  });
