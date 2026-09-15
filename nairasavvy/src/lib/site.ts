export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://nairasavvy.ng"
).replace(/\/$/, "");
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
