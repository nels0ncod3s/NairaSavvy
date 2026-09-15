import type { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "The Naira Shield: Free Money Insights",
  description:
    "Practical savings comparisons, consumer updates and money guides delivered by email. Free to join.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "The Naira Shield: Free Financial Intelligence",
    description:
      "Free newsletter for Nigerians who want to protect, fight back, and grow their money.",
    url: "/newsletter",
  },
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
