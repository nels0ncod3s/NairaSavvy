import type { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "The Naira Shield: Free Weekly Intelligence",
  description:
    "Every week: the best rates, bank alerts, your consumer rights, and the moves smart Nigerians are making. Free forever.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: "The Naira Shield: Free Weekly Financial Intelligence",
    description:
      "Free weekly newsletter for Nigerians who want to protect, fight back, and grow their money.",
    url: "/newsletter",
  },
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
