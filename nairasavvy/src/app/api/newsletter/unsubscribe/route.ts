import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { tokenHash, tokenSchema } from "@/lib/newsletter";
import { siteUrl } from "@/lib/site";
export async function POST(request: Request) {
  const redirect = (result: string) =>
    NextResponse.redirect(
      new URL("/newsletter/unsubscribe?result=" + result, siteUrl),
      303,
    );
  try {
    const token = tokenSchema.safeParse(
      (await request.formData()).get("token"),
    );
    if (!token.success) return redirect("invalid");
    const client = await createServiceClient();
    if (!client) return redirect("unavailable");
    const { error } = await client
      .from("subscribers")
      .delete()
      .eq("unsubscribe_hash", tokenHash(token.data));
    if (error) return redirect("unavailable");

    return redirect("success");
  } catch {
    return redirect("unavailable");
  }
}
