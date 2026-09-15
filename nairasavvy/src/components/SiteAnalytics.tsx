"use client";
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
export default function SiteAnalytics() {
  const path = usePathname();
  // Do not send pages containing subscription bearer tokens to analytics.
  if (path.startsWith("/newsletter/")) return null;
  return (
    <Analytics
      beforeSend={(event) => ({ ...event, url: event.url.split("?")[0] })}
    />
  );
}
