import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nairasavvy.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NairaSavvy: Nigeria's Financial Intelligence Platform",
    template: "%s | NairaSavvy",
  },
  description:
    "Free guides, tools, and alerts to protect your money, fight back against banks, and grow what you have. Nigeria's premier consumer financial intelligence platform.",
  keywords: [
    "Nigeria savings accounts",
    "best APY Nigeria 2026",
    "inflation calculator Nigeria",
    "consumer rights Nigeria",
    "NBS inflation rate",
    "PiggyVest vs Cowrywise",
    "CBN complaint",
    "naira erosion",
    "financial education Nigeria",
  ],
  authors: [{ name: "NairaSavvy Editorial Team" }],
  creator: "KwenuAI",
  publisher: "NairaSavvy",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "NairaSavvy",
    title: "NairaSavvy: Nigeria's Financial Intelligence Platform",
    description:
      "Free guides, tools, and alerts to protect your money, fight back against banks, and grow what you have.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "NairaSavvy: Nigeria's Financial Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NairaSavvy: Nigeria's Financial Intelligence Platform",
    description:
      "Free guides, tools, and alerts to protect your money, fight back against banks, and grow what you have.",
    images: ["/og-default.png"],
    creator: "@NairaSavvy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NairaSavvy",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: ["https://twitter.com/NairaSavvy"],
  description:
    "Nigeria's premier consumer financial intelligence platform. Free guides, tools, and alerts to protect your money, fight back against banks, and grow what you have.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NG",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NairaSavvy",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <head>
        {/* Google Fonts: loaded via browser for zero build-time dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
