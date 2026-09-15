import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";
export const subscriptionSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z
    .string()
    .max(200)
    .regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/)
    .default("/newsletter"),
  website: z.string().max(0).optional(),
});
export const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export async function subscribe(input: z.infer<typeof subscriptionSchema>) {
  const client = await createServiceClient();
  if (
    !client ||
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL ||
    !process.env.NEXT_PUBLIC_SITE_URL
  )
    return {
      status: 503,
      error:
        "Newsletter signup is temporarily unavailable. Please try again later.",
    };
  const { data: globalAllowed, error: globalError } = await client.rpc(
    "newsletter_allow_request",
    { bucket_key: "global-subscribe", window_seconds: 60, max_requests: 60 },
  );
  if (globalError || !globalAllowed)
    return {
      status: 503,
      error: "Newsletter signup is busy. Please try again later.",
    };
  const bucket = tokenHash(`subscribe:${input.email}`);
  const { data: allowed, error: limitError } = await client.rpc(
    "newsletter_allow_request",
    { bucket_key: bucket, window_seconds: 60, max_requests: 1 },
  );
  if (limitError)
    return {
      status: 503,
      error:
        "Newsletter signup is temporarily unavailable. Please try again later.",
    };
  if (!allowed)
    return { status: 429, error: "Please wait a minute before trying again." };
  const confirmation = randomBytes(32).toString("hex");
  const unsubscribe = randomBytes(32).toString("hex");
  const { error: insertError } = await client.from("subscribers").upsert(
    {
      email: input.email,
      source: input.source,
      active: false,
      confirmed: false,
    },
    { onConflict: "email", ignoreDuplicates: true },
  );
  if (insertError)
    return {
      status: 503,
      error: "We could not save your signup. Please try again later.",
    };
  const { data: existing, error: readError } = await client
    .from("subscribers")
    .select("id, confirmed, active")
    .eq("email", input.email)
    .single();
  if (readError || !existing)
    return {
      status: 503,
      error: "We could not save your signup. Please try again later.",
    };
  const message =
    "If your address needs confirmation, check your inbox for a link. Already confirmed? You remain subscribed.";
  if (existing.confirmed && existing.active) return { status: 202, message };
  const { error: saveError } = await client
    .from("subscribers")
    .update({
      confirmation_hash: tokenHash(confirmation),
      confirmation_expires_at: new Date(Date.now() + 86400000).toISOString(),
      unsubscribe_hash: tokenHash(unsubscribe),
      last_confirmation_at: new Date().toISOString(),
      source: input.source,
    })
    .eq("id", existing.id);
  if (saveError)
    return {
      status: 503,
      error: "We could not prepare your confirmation. Please try again later.",
    };
  const confirmUrl = `${siteUrl}/newsletter/confirm?token=${confirmation}`;
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${unsubscribe}`;
  const { error: sendError } = await new Resend(
    process.env.RESEND_API_KEY,
  ).emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: input.email,
    subject: "Confirm your Naira Shield subscription",
    text: `You requested NairaSavvy updates. Confirm your subscription within 24 hours:\n${confirmUrl}\n\nIf you did not request this, ignore this email. To remove this signup or unsubscribe:\n${unsubscribeUrl}`,
  });
  if (sendError)
    return {
      status: 503,
      error:
        "Your signup is pending, but the confirmation email could not be sent. Please retry in a minute.",
    };
  return { status: 202, message };
}
