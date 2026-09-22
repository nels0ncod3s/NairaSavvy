import { SendByte } from "@sendbyte/node";
import { z } from "zod";
import { agentDb, check } from "./db";
import { briefSchema, escapeHtml } from "./model";
export const editionSchema = z.object({
  id: z.uuid(),
  subject: z.string().min(1).max(200),
  stories: z
    .array(z.object({ id: z.uuid(), content: briefSchema }))
    .min(1)
    .max(20),
});
export function renderEdition(input: unknown, origin: string, token: string) {
  const edition = editionSchema.parse(input);
  const url = new URL(origin);
  if (url.protocol !== "https:")
    throw new Error("Newsletter origin must use HTTPS");
  if (!/^[a-f0-9]{64}$/.test(token))
    throw new Error("Invalid unsubscribe token");
  const unsubscribe = `${url.origin}/newsletter/leave?token=${token}`;
  const oneClick = `${url.origin}/api/newsletter/leave?token=${token}`;
  const text = edition.stories
    .map(
      ({ id, content: c }) =>
        `${c.title}\n\n${c.paragraphs.join("\n\n")}\nSource: ${c.source} — ${c.sourceUrl}\nRead: ${url.origin}/briefings/${id}`,
    )
    .join("\n\n———\n\n");
  const html = edition.stories
    .map(
      ({ id, content: c }) =>
        `<article><h2>${escapeHtml(c.title)}</h2>${c.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}<p>Source: <a href="${escapeHtml(c.sourceUrl)}">${escapeHtml(c.source)}</a></p><p><a href="${url.origin}/briefings/${id}">Read on NairaSavvy</a></p></article>`,
    )
    .join("<hr>");
  return {
    text: `The Naira Shield\n\n${text}\n\nUnsubscribe: ${unsubscribe}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.7;max-width:640px;margin:auto"><h1>The Naira Shield</h1>${html}<hr><p>You subscribed to NairaSavvy. <a href="${unsubscribe}">Unsubscribe</a></p></div>`,
    oneClick,
  };
}
export function provider() {
  if (!process.env.SENDBYTE_API_KEY?.startsWith("sk_live_"))
    throw new Error("Live SendByte key required");
  return new SendByte(process.env.SENDBYTE_API_KEY, {
    timeoutMs: 10000,
    maxAttempts: 1,
  });
}
export async function reconcile(providerId: string) {
  const remote = await provider().emails.get(providerId);
  if (remote.sandbox) throw new Error("Sandbox message cannot be reconciled");
  const db = agentDb();
  const { data: job, error } = await db
    .from("agent_deliveries")
    .select("id,subscriber_id,status")
    .eq("provider_id", providerId)
    .maybeSingle();
  check(error);
  if (!job) return;
  const suppressed = ["bounced", "complained", "suppressed"].includes(
    remote.status,
  );
  // Never undo a previously recorded suppression on an out-of-order event.
  if (suppressed && job.subscriber_id) {
    const r = await db.rpc("agent_suppress", {
      provider: providerId,
      event_key: `status:${providerId}:${remote.status}`,
    });
    check(r.error);
  }
  if (
    job.status === "suppressed" ||
    (job.status === "delivered" && !suppressed)
  )
    return;
  const status = suppressed
    ? "suppressed"
    : remote.status === "delivered"
      ? "delivered"
      : remote.status === "sent"
        ? "sent"
        : "queued";
  const r = await db
    .from("agent_deliveries")
    .update({
      status,
      detail: remote.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id);
  check(r.error);
}
export async function sendBatch(limit = 20) {
  if (process.env.AGENTS_SEND_ENABLED !== "true")
    throw new Error(
      "Sending paused: set AGENTS_SEND_ENABLED=true only after testing",
    );
  if (
    !process.env.SENDBYTE_FROM_EMAIL ||
    !process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
  )
    throw new Error("Verified sender and HTTPS site origin required");
  const mail = provider();
  const db = agentDb();
  let processed = 0;
  // Check previous deliveries before starting another batch; abort if provider unavailable.
  const pending = await db
    .from("agent_deliveries")
    .select("provider_id")
    .in("status", ["queued", "sent"])
    .order("updated_at")
    .limit(100);
  check(pending.error);
  for (const row of pending.data ?? [])
    if (row.provider_id) await reconcile(row.provider_id);
  for (let i = 0; i < Math.min(Math.max(limit, 1), 100); i++) {
    const claimed = await db.rpc("agent_claim");
    check(claimed.error);
    const job = claimed.data?.[0];
    if (!job) break;
    try {
      const edition = await db
        .from("agent_editions")
        .select("id,subject,stories")
        .eq("id", job.edition_id)
        .single();
      check(edition.error);
      const content = renderEdition(
        edition.data,
        process.env.NEXT_PUBLIC_SITE_URL,
        job.unsubscribe_token,
      );
      // Re-read consent immediately before the outbound request, including during retries/restarts.
      const recipient = await db
        .from("subscribers")
        .select("email,active,confirmed")
        .eq("id", job.subscriber_id)
        .maybeSingle();
      check(recipient.error);
      if (!recipient.data?.active || !recipient.data.confirmed) {
        const r = await db
          .from("agent_deliveries")
          .update({
            status: "suppressed",
            detail: "No active confirmed subscription",
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
        check(r.error);
        continue;
      }
      const sent = await mail.emails.send({
        from: process.env.SENDBYTE_FROM_EMAIL,
        to: recipient.data.email,
        subject: edition.data!.subject,
        text: content.text,
        html: content.html,
        list_unsubscribe: { url: content.oneClick },
        idempotency_key: `edition:${job.id}`,
      });
      if (!sent.id || sent.sandbox)
        throw new Error("Provider did not confirm live queueing");
      const saved = await db
        .from("agent_deliveries")
        .update({
          status: "queued",
          provider_id: sent.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
      check(saved.error);
      processed++;
    } catch {
      // Do not log subscriber addresses or tokens and do not retry an ambiguous send.
      const r = await db
        .from("agent_deliveries")
        .update({
          status: "uncertain",
          detail:
            "Inspect SendByte logs before retrying; delivery may have been accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
      check(r.error);
      throw new Error(`Delivery ${job.id} needs reconciliation; batch stopped`);
    }
  }
  return { processed };
}
