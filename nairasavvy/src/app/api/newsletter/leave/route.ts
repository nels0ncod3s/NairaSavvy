import { agentDb, check } from "@/lib/agents/db";
import { tokenSchema, tokenHash } from "@/lib/newsletter";
// RFC 8058 POST endpoint. GET never changes consent (email scanners follow links).
export async function POST(request: Request) {
  const parsed = tokenSchema.safeParse(
    new URL(request.url).searchParams.get("token"),
  );
  if (!parsed.success)
    return new Response("Invalid unsubscribe link", { status: 400 });
  try {
    const r = await agentDb().rpc("agent_unsubscribe", {
      token_hash: tokenHash(parsed.data),
    });
    check(r.error);
    return new Response(
      "You have been unsubscribed. You will not receive further newsletters.",
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  } catch {
    return new Response(
      "Unsubscribe is temporarily unavailable. Please try again.",
      { status: 503 },
    );
  }
}
