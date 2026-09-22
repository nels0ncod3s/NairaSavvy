import { writeBrief } from "./writer";
import { agentDb, check } from "./db";
import { hash, itemSchema, briefSchema, type Brief } from "./model";

export async function curate() {
  const db = agentDb();
  const { data, error } = await db.rpc("agent_uncurated");
  check(error);
  let created = 0;
  for (const row of data ?? []) {
    const content = await writeBrief(itemSchema.parse(row.item));
    const result = await db
      .from("agent_drafts")
      .upsert(
        {
          fingerprint: row.fingerprint,
          content,
          revision: hash(JSON.stringify(content)),
        },
        { onConflict: "fingerprint", ignoreDuplicates: true },
      )
      .select("id");
    check(result.error);
    created += result.data?.length ?? 0;
  }
  return { created };
}
export async function editDraft(id: string, revision: string, input: unknown) {
  const content = briefSchema.parse(input);
  const { data, error } = await agentDb()
    .from("agent_drafts")
    .update({ content, revision: hash(JSON.stringify(content)) })
    .eq("id", id)
    .eq("revision", revision)
    .eq("status", "needs_review")
    .select("id");
  check(error);
  if (!data?.length) throw new Error("Draft changed or already reviewed");
  return content;
}
export async function publish(id: string, revision: string, reviewer: string) {
  const { data, error } = await agentDb().rpc("agent_publish", {
    draft_id: id,
    expected_revision: revision,
    reviewer_name: reviewer,
  });
  check(error);
  return data;
}
export async function makeEdition(
  ids: string[],
  subject: string,
  reviewer: string,
) {
  if (
    !ids.length ||
    ids.length > 20 ||
    new Set(ids).size !== ids.length ||
    !subject.trim() ||
    subject.length > 200 ||
    reviewer.trim().length < 2
  )
    throw new Error("Choose 1–20 unique briefings, a subject and a reviewer");
  const db = agentDb();
  const { data, error } = await db
    .from("agent_briefings")
    .select("id,content,published_at")
    .in("id", ids);
  check(error);
  if (data?.length !== ids.length)
    throw new Error("All stories must be published before building an edition");
  const stories = ids.map((id) => {
    const row = data.find((r) => r.id === id)!;
    return { id, content: briefSchema.parse(row.content) };
  });
  const result = await db
    .from("agent_editions")
    .insert({ subject: subject.trim(), stories, reviewer: reviewer.trim() })
    .select("id")
    .single();
  check(result.error);
  return result.data;
}
export type PublishedBrief = {
  id: string;
  content: Brief;
  published_at: string;
};
export async function briefings(): Promise<{
  items: PublishedBrief[];
  unavailable: boolean;
}> {
  try {
    const { data, error } = await agentDb(true)
      .from("agent_briefings")
      .select("id,content,published_at")
      .order("published_at", { ascending: false })
      .limit(50);
    check(error);
    return {
      items: (data ?? []).map((row) => ({
        ...row,
        content: briefSchema.parse(row.content),
      })),
      unavailable: false,
    };
  } catch {
    return { items: [], unavailable: true };
  }
}
