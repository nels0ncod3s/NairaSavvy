import { NextResponse } from "next/server";
import { subscribe, subscriptionSchema } from "@/lib/newsletter";
export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json"))
      return NextResponse.json(
        { error: "Send a JSON request." },
        { status: 415 },
      );
    // Bound the body while reading, including chunked requests.
    const reader = request.body?.getReader();
    if (!reader)
      return NextResponse.json({ error: "Email required." }, { status: 400 });
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4096) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Request too large." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    let body: unknown;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }
    const parsed = subscriptionSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    const result = await subscribe(parsed.data);
    return NextResponse.json(result, {
      status: result.status,
      headers: {
        "Cache-Control": "no-store",
        ...(result.status === 429 ? { "Retry-After": "60" } : {}),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Newsletter signup is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  }
}
