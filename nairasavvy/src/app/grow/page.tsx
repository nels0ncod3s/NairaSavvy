import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Grow What You Have",
  description:
    "T-bills, dollar accounts, mutual funds, and more \u2014 explained in plain English with real numbers for everyday Nigerians.",
  alternates: { canonical: "/grow" },
  openGraph: {
    title: "Grow What You Have | NairaSavvy",
    description:
      "Every naira you're not growing is shrinking. Practical investment options for Nigerians \u2014 no jargon.",
    url: "/grow",
  },
};

export default function GrowPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        <section
          id="hero-sentinel"
          style={{ backgroundColor: "#F5F0E8", padding: "100px 24px 80px" }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span className="category-tag" style={{ marginBottom: "20px", display: "inline-block" }}>Grow</span>
            <h1 className="type-h1" style={{ color: "#1A1A1A", marginBottom: "24px" }}>
              Every naira you&apos;re not growing is shrinking.
            </h1>
            <p className="type-body" style={{ color: "#6B6560", maxWidth: "600px", marginBottom: "0", fontSize: "18px", lineHeight: "1.7" }}>
              With inflation at 32.7%, cash is a bad investment. T-bills, dollar savings, mutual funds, and money market accounts are accessible to everyday Nigerians \u2014 but most people don&apos;t know where to start. We break them down.
            </p>
          </div>
        </section>
        <section style={{ padding: "0 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <div style={{ backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", padding: "32px" }}>
              <p className="type-body" style={{ color: "#1A1A1A", margin: 0, lineHeight: "1.8" }}>
                Growing your money in Nigeria requires understanding a few key options. Nigerian Treasury Bills (T-bills) currently offer returns above 20% per annum \u2014 higher than most savings accounts. Dollar-denominated accounts protect against naira devaluation. Money market funds offer daily liquidity with better returns than a savings account.
              </p>
            </div>
          </div>
        </section>
        <section style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "40px" }}>Grow Guides</h2>
            <ArticleGrid category="grow" />
          </div>
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
