import { SIGNATURE_HEADER, verifyWebhookSignature } from "@sendbyte/node";
import { z } from "zod";
import { agentDb, check } from "@/lib/agents/db";
import { reconcile } from "@/lib/agents/sendy";
export async function POST(request: Request) {
  const secret = process.env.SENDBYTE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });
  if (Number(request.headers.get("content-length")) > 65536)
    return new Response("Too large", { status: 413 });
  const body = await request.text();
  if (body.length > 65536) return new Response("Too large", { status: 413 });
  if (
    !verifyWebhookSignature(
      secret,
      request.headers.get(SIGNATURE_HEADER) ?? undefined,
      body,
    )
  )
    return new Response("Invalid signature", { status: 401 });
  try {
    const event = z
      .object({
        type: z.string(),
        data: z.object({ email_id: z.string().min(1).max(200) }),
      })
      .safeParse(JSON.parse(body));
    if (!event.success)
      return new Response("Unsupported event payload", { status: 400 });
    if (
      ["email.bounced", "email.complained", "email.unsubscribed"].includes(
        event.data.type,
      )
    ) {
      const r = await agentDb().rpc("agent_suppress", {
        provider: event.data.data.email_id,
        event_key: `event:${event.data.type}:${event.data.data.email_id}`,
      });
      check(r.error);
      return Response.json({ received: true });
    }
    // Fetch the current provider state; duplicate/out-of-order callbacks cannot invent statuses.
    await reconcile(event.data.data.email_id);
    return Response.json({ received: true });
  } catch {
    return new Response("Reconciliation failed; retry later", { status: 503 });
  }
}
