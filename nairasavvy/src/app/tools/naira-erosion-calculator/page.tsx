import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import ErosionCalculator from "@/components/tools/ErosionCalculator";

export const metadata: Metadata = {
  title: "Naira Erosion Calculator — See What Inflation Is Costing You",
  description:
    "Enter your savings balance and see exactly how much your naira loses to inflation over time. Free tool by NairaSavvy.",
  alternates: { canonical: "/tools/naira-erosion-calculator" },
  openGraph: {
    title: "Naira Erosion Calculator | NairaSavvy",
    description:
      "See the real naira value of your savings after inflation. Enter your balance, choose a timeframe, get the truth.",
    url: "/tools/naira-erosion-calculator",
  },
};

export default function NairaErosionCalculatorPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#0F0F0D", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          id="hero-sentinel"
          style={{ padding: "100px 24px 64px" }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span
              style={{
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: "#1B5E3B",
                backgroundColor: "#E8F5EE",
                padding: "4px 10px",
                borderRadius: "2px",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              Free Tool
            </span>
            <h1
              className="type-h1"
              style={{ color: "#FFFFFF", marginBottom: "20px" }}
            >
              Naira Erosion Calculator
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
                fontSize: "18px",
                lineHeight: "1.7",
                color: "#888884",
                maxWidth: "600px",
              }}
            >
              Your savings account shows a number. Inflation shows a
              different one. This tool shows you the real difference — in
              naira, not percentages.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section style={{ padding: "0 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "860px" }}>
            <ErosionCalculator />
          </div>
        </section>

        {/* What this means section */}
        <section
          style={{
            padding: "80px 24px 100px",
            backgroundColor: "#1C1C1A",
            borderTop: "1px solid #2A2A28",
          }}
        >
          <div className="container-content" style={{ maxWidth: "720px" }}>
            <h2
              className="type-h2"
              style={{ color: "#FFFFFF", marginBottom: "32px" }}
            >
              What can you do about it?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  title: "Find accounts that beat inflation",
                  body: "Some savings products pay above 20% APY. See the full NairaGuard comparison table.",
                  href: "/savings",
                  cta: "View NairaGuard",
                },
                {
                  title: "Invest in T-bills or money markets",
                  body: "Nigerian Treasury Bills and money market funds offer returns that outpace most savings accounts.",
                  href: "/grow",
                  cta: "Grow your money",
                },
                {
                  title: "Get weekly alerts",
                  body: "Rate changes, new deals, and policy shifts that affect your savings — delivered free every week.",
                  href: "/newsletter",
                  cta: "Get the Naira Shield",
                },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      backgroundColor: "#0F0F0D",
                      border: "1px solid #2A2A28",
                      borderRadius: "4px",
                      padding: "28px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-serif, Georgia, serif)",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "14px",
                        color: "#888884",
                        margin: 0,
                        flex: 1,
                        lineHeight: "1.6",
                      }}
                    >
                      {card.body}
                    </p>
                    <span
                      style={{
                        color: "#1B5E3B",
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                      }}
                    >
                      {card.cta} &rarr;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
