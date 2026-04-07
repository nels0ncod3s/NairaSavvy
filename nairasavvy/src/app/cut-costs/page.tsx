import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Cut the Hidden Costs",
  description:
    "Find and eliminate hidden bank charges, data billing errors, overpriced insurance, and the everyday costs most Nigerians don't notice.",
  alternates: { canonical: "/cut-costs" },
  openGraph: {
    title: "Cut the Hidden Costs | NairaSavvy",
    description:
      "You're paying more than you should. Here's where to stop.",
    url: "/cut-costs",
  },
};

export default function CutCostsPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
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
              Cut Costs
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              You&apos;re paying more than you should. Here&apos;s where to stop.
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
              Hidden bank maintenance fees. SMS charges at ₦4 per message.
              Data plans that bill you for services you didn&apos;t use. Insurance
              policies with clauses that make them useless. The costs you
              don&apos;t see are often bigger than the ones you do.
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
                The average Nigerian pays thousands of naira per year in charges
                they&apos;ve never explicitly agreed to. Bank account maintenance
                fees, card issuance fees, transfer fees that differ by channel,
                and ATM charges that add up. These erode savings quietly.
                We&apos;ll help you audit your statements, identify unnecessary
                charges, and get refunds where you&apos;re entitled.
              </p>
            </div>
          </div>
        </section>

        {/* Data Plans Tool — featured card */}
        <section className="ns-section">
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "32px" }}
            >
              Tools
            </h2>
            <Link href="/cut-costs/data-plans" style={{ textDecoration: "none", display: "block", maxWidth: "640px" }}>
              <div
                style={{
                  backgroundColor: "#0F0F0D",
                  borderRadius: "4px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "transform 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                    color: "#1B5E3B",
                    backgroundColor: "#E8F5EE",
                    padding: "3px 10px",
                    borderRadius: "2px",
                    alignSelf: "flex-start",
                  }}
                >
                  Live Tool
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    margin: 0,
                    lineHeight: "1.25",
                  }}
                >
                  Data Plan Comparison: MTN vs Airtel vs Glo vs T2 Mobile
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: "16px",
                    color: "#888884",
                    margin: 0,
                    lineHeight: "1.65",
                  }}
                >
                  36 plans compared and scored by GB per ₦1,000. Filter by
                  network. Copy activation codes instantly. Find the hidden
                  deals the networks don&apos;t advertise.
                </p>
                <span
                  style={{
                    color: "#1B5E3B",
                    fontSize: "15px",
                    fontWeight: 600,
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  }}
                >
                  Compare all plans &rarr;
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Articles */}
        <section className="ns-section">
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Cut Costs Guides
            </h2>
            <ArticleGrid category="cut-costs" />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
