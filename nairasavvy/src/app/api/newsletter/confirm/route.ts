import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { tokenHash, tokenSchema } from "@/lib/newsletter";
import { siteUrl } from "@/lib/site";
export async function POST(request: Request) {
  const redirect = (result: string) =>
    NextResponse.redirect(
      new URL("/newsletter/confirm?result=" + result, siteUrl),
      303,
    );
  try {
    const token = tokenSchema.safeParse(
      (await request.formData()).get("token"),
    );
    if (!token.success) return redirect("invalid");
    const client = await createServiceClient();
    if (!client) return redirect("unavailable");
    const { data, error } = await client
      .from("subscribers")
      .update({
        confirmed: true,
        active: true,
        confirmation_hash: null,
        confirmation_expires_at: null,
      })
      .eq("confirmation_hash", tokenHash(token.data))
      .gt("confirmation_expires_at", new Date().toISOString())
      .select("id");
    if (error) return redirect("unavailable");
    if (!data?.length) return redirect("invalid");
    return redirect("success");
  } catch {
    return redirect("unavailable");
  }
}
