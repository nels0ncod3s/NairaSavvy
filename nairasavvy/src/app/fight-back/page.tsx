import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Fight Back Against Banks and Bad Systems",
  description:
    "Know your rights as a Nigerian bank customer. Templates, guides, and tools to resolve disputes, file CBN complaints, and hold banks accountable.",
  alternates: { canonical: "/fight-back" },
  openGraph: {
    title: "Fight Back Against Banks and Bad Systems | NairaSavvy",
    description:
      "Know your rights. Use them. CBN complaints, failed transaction disputes, and consumer protection in plain English.",
    url: "/fight-back",
  },
};

export default function FightBackPage() {
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
              Fight Back
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              Know your rights. Use them.
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
              Nigerian banks rely on you not knowing the rules. Failed
              transactions, mystery charges, locked accounts, and debit card
              fraud. You have legal rights in every case. Here&apos;s how to
              enforce them.
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
                The Central Bank of Nigeria&apos;s Consumer Protection Regulations
                (2022) give you clear rights as a bank customer. Banks are
                required to resolve failed transaction disputes within{" "}
                <strong>72 hours</strong>, provide refunds for erroneous
                charges, and respond to CBN complaints within{" "}
                <strong>5 business days</strong>. Most Nigerians never collect
                what they&apos;re owed, simply because they don&apos;t know to ask.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Tools */}
        <section className="ns-section">
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Tools
            </h2>

            {/* Complaint Letter Generator — notify on launch */}
            <div
              style={{
                backgroundColor: "#0F0F0D",
                borderRadius: "4px",
                padding: "40px",
                maxWidth: "560px",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>✉️</div>
              <h3
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                Complaint Letter Generator
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "16px",
                  lineHeight: "1.7",
                  color: "#888884",
                  marginBottom: "12px",
                }}
              >
                Generate a legally-worded complaint letter to your bank or the
                CBN in under 2 minutes — with the right regulation citations,
                a resolution deadline, and the correct escalation channel.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  color: "#888884",
                  marginBottom: "28px",
                }}
              >
                This tool is in development. Subscribe to the Naira Shield and
                we&apos;ll email you the moment it launches.
              </p>
              <a
                href="/newsletter"
                style={{
                  display: "inline-block",
                  backgroundColor: "#1B5E3B",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "14px 24px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                Get notified when it launches &rarr;
              </a>
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
              Fight Back Guides
            </h2>
            <ArticleGrid category="fight-back" />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
