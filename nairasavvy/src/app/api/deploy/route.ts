import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/deploy
 *
 * Webhook endpoint to trigger a Vercel production redeployment.
 * Used by the Apollo content agent when an article is approved.
 *
 * Required header: x-webhook-secret: [CONTENT_WEBHOOK_SECRET]
 * Optional body:   { reason: "content-approved", articleSlug: "..." }
 */
export async function POST(request: NextRequest) {
  // ── Verify webhook secret ────────────────────────────────────────────────
  const secret = request.headers.get("x-webhook-secret");
  const expectedSecret = process.env.CONTENT_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error("[deploy] CONTENT_WEBHOOK_SECRET env var not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse optional body ──────────────────────────────────────────────────
  let body: { reason?: string; articleSlug?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Body is optional
  }

  // ── Trigger Vercel deploy hook ───────────────────────────────────────────
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    console.error("[deploy] VERCEL_DEPLOY_HOOK_URL env var not set");
    return NextResponse.json(
      {
        error: "Deploy hook not configured",
        hint: "Add VERCEL_DEPLOY_HOOK_URL to Vercel environment variables",
      },
      { status: 500 },
    );
  }

  try {
    const hook = new URL(deployHookUrl);
    if (
      hook.protocol !== "https:" ||
      hook.hostname !== "api.vercel.com" ||
      !hook.pathname.startsWith("/v1/integrations/deploy/")
    ) {
      return NextResponse.json(
        { error: "Deploy hook misconfigured" },
        { status: 503 },
      );
    }
    const response = await fetch(hook, {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Deploy hook responded ${response.status}: ${text}`);
    }

    const data = await response.json();

    console.log("[deploy] Deployment triggered:", {
      reason: body.reason ?? "manual",
      articleSlug: body.articleSlug,
      deployId: data.job?.id,
    });

    return NextResponse.json({
      success: true,
      deployId: data.job?.id ?? null,
      message: "Deployment triggered successfully",
      reason: body.reason ?? "manual",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[deploy] Deploy hook failed:", message);
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 });
  }
}
