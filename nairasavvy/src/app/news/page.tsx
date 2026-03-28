import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "What's Happening With Your Money",
  description:
    "CBN circulars, fintech updates, and banking news translated into plain English for everyday Nigerians.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "What's Happening With Your Money | NairaSavvy",
    description:
      "CBN circulars. Fintech updates. Translated into plain English.",
    url: "/news",
  },
};

export default function NewsPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        {/* Hero */}
        <section
          id="hero-sentinel"
          style={{
            backgroundColor: "#F5F0E8",
            padding: "100px 24px 80px",
          }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span
              className="category-tag"
              style={{ marginBottom: "20px", display: "inline-block" }}
            >
              News
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              CBN circulars. Fintech updates. Translated into plain English.
            </h1>
            <p
              className="type-body"
              style={{
                color: "#6B6560",
                maxWidth: "600px",
                marginBottom: "0",
                fontSize: "18px",
                lineHeight: "1.7",
              }}
            >
              Every CBN directive, fintech policy change, and banking update
              that affects your money, explained without the regulatory
              jargon. We tell you what it means and what to do.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Latest
            </h2>
            <ArticleGrid category="news" />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
