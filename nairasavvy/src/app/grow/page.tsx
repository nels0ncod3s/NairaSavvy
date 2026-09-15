import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Grow What You Have",
  description:
    "T-bills, dollar accounts, mutual funds, and more, explained in plain English with real numbers for everyday Nigerians.",
  alternates: { canonical: "/grow" },
  openGraph: {
    title: "Grow What You Have | NairaSavvy",
    description:
      "Every naira you're not growing is shrinking. Practical investment options for Nigerians, no jargon.",
    url: "/grow",
  },
};

export default function GrowPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ backgroundColor: "#F5F0E8" }}
      >
        {/* Hero */}
        <section
          id="hero-sentinel"
          className="ns-hero"
          style={{ backgroundColor: "#F5F0E8" }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span
              className="category-tag"
              style={{ marginBottom: "20px", display: "inline-block" }}
            >
              Grow
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              Every naira you&apos;re not growing is shrinking.
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
              Understand your time horizon, currency and access needs before
              comparing T-bills, dollar savings, mutual funds, and money market
              accounts are accessible to everyday Nigerians, but most people
              don&apos;t know where to start. We break them down.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="ns-section">
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <div
              style={{
                backgroundColor: "#FAFAF7",
                border: "1px solid #D4CFC8",
                borderRadius: "4px",
                padding: "32px",
              }}
            >
              <p
                className="type-body"
                style={{ color: "#1A1A1A", margin: 0, lineHeight: "1.8" }}
              >
                Compare each product on its own terms. Treasury bills, funds and
                deposit accounts have different access rules, fees and risks.
                Foreign-currency products also expose you to exchange-rate
                changes. Begin with your goal and the provider’s documented
                terms before comparing returns.
              </p>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="ns-section">
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Grow Guides
            </h2>
            <ArticleGrid category="grow" />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
