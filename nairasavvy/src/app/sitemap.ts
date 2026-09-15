import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...[
      "",
      "/about",
      "/articles",
      "/savings",
      "/fight-back",
      "/grow",
      "/cut-costs",
      "/cut-costs/data-plans",
      "/news",
      "/newsletter",
      "/tools/naira-erosion-calculator",
      "/tools/complaint-letter",
      "/editorial-policy",
      "/privacy",
      "/terms",
    ].map((path) => ({ url: siteUrl + path })),
    ...getAllArticles()
      .filter((a) => !a.reviewRequired)
      .map((a) => ({
        url: `${siteUrl}/articles/${a.slug}`,
        lastModified: a.updatedAt || a.publishedAt,
      })),
  ];
}
