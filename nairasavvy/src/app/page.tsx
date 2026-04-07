import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NairaGuardDashboard from "@/components/home/NairaGuardDashboard";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";
import ErosionCalculator from "@/components/tools/ErosionCalculator";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const pillars = [
  {
    num: "01",
    label: "Protect",
    heading: "Stop your savings from being eaten alive by inflation.",
    body: "Nigeria's inflation is running above 15%. If your savings account isn't keeping pace, you're losing real money every single month. We show you exactly which accounts beat inflation and which ones don't.",
    cta: "See the NairaGuard table",
    href: "/savings",
  },
  {
    num: "02",
    label: "Fight Back",
    heading: "Banks fail you. We give you the tools to fight back.",
    body: "Failed POS transactions. Mystery charges. Locked accounts. The CBN gives you legal rights in every one of these cases. Most Nigerians never collect what they're owed simply because they don't know to ask.",
    cta: "Know your rights",
    href: "/fight-back",
  },
  {
    num: "03",
    label: "Grow",
    heading: "Find every legal edge to make your money work harder.",
    body: "T-bills above 20%. Money market funds at 22–26%. Dollar savings accounts. These options exist for everyday Nigerians, not just the wealthy. We break them down in plain English with real numbers.",
    cta: "Explore growth options",
    href: "/grow",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          id="hero-sentinel"
          className="ns-hero-main"
          style={{ backgroundColor: "#F5F0E8" }}
        >
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <h1
              className="type-display hero-animate-1"
              style={{ color: "#1A1A1A", marginBottom: "28px" }}
            >
              Nigeria&apos;s financial system
              <br />
              wasn&apos;t built for you.
              <br />
              <span style={{ color: "#1B5E3B" }}>NairaSavvy was.</span>
            </h1>
            <p
              className="type-body hero-animate-2"
              style={{
                color: "#6B6560",
                fontSize: "18px",
                lineHeight: "1.7",
                maxWidth: "540px",
                margin: "0 auto 48px",
              }}
            >
              Free guides, tools, and alerts to protect your money, fight back
              against banks, and grow what you have.
            </p>
            <div className="hero-animate-3">
              <Link href="/newsletter" className="btn-primary" style={{ fontSize: "16px", padding: "16px 32px" }}>
                Get Free Alerts &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── PILLAR CARDS 01 / 02 / 03 ────────────────────── */}
        <section className="ns-section" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container-content">
            <div
              style={{
                display: "grid",
                /* min() ensures cards never overflow on narrow screens */
                gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                gap: "24px",
              }}
            >
              {pillars.map((p, i) => (
                <AnimateOnScroll key={p.num} delay={i * 120} variant="fadeUp">
                  <Link
                    href={p.href}
                    style={{ textDecoration: "none", display: "block", height: "100%" }}
                  >
                    <div
                      className="card"
                      style={{
                        borderRadius: "4px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.1em",
                            color: "#9CA3A0",
                          }}
                        >
                          {p.num}
                        </span>
                        <span className="category-tag">{p.label}</span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "clamp(18px, 3vw, 22px)",
                          fontWeight: 700,
                          color: "#1A1A1A",
                          lineHeight: "1.3",
                          margin: 0,
                        }}
                      >
                        {p.heading}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                          fontSize: "15px",
                          lineHeight: "1.7",
                          color: "#6B6560",
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {p.body}
                      </p>
                      <span
                        style={{
                          color: "#1B5E3B",
                          fontSize: "14px",
                          fontWeight: 600,
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        }}
                      >
                        {p.cta} &rarr;
                      </span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── NAIRA-GUARD DASHBOARD ─────────────────────────── */}
        <section id="naira-guard" className="ns-section" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container-content">
            <AnimateOnScroll style={{ marginBottom: "40px" }}>
              <p
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#9CA3A0",
                  marginBottom: "12px",
                }}
              >
                04 — NairaGuard
              </p>
              <h2 className="type-h2" style={{ color: "#1A1A1A" }}>
                Is your money working hard enough?
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100} variant="scale">
              <NairaGuardDashboard />
            </AnimateOnScroll>
          </div>
        </section>

        {/* ── LATEST ARTICLES ──────────────────────────────── */}
        <section className="ns-section" style={{ backgroundColor: "#FAFAF7" }}>
          <div className="container-content">
            <AnimateOnScroll
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap" as const,
                gap: "16px",
                marginBottom: "40px",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    color: "#9CA3A0",
                    marginBottom: "12px",
                  }}
                >
                  05 — Latest
                </p>
                <h2 className="type-h2" style={{ color: "#1A1A1A", margin: 0 }}>
                  What you need to know this week.
                </h2>
              </div>
              <Link
                href="/articles"
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#1B5E3B",
                  textDecoration: "none",
                  whiteSpace: "nowrap" as const,
                }}
              >
                See all guides &rarr;
              </Link>
            </AnimateOnScroll>
            <ArticleGrid />
          </div>
        </section>

        {/* ── NAIRA EROSION CALCULATOR ─────────────────────── */}
        <section className="ns-section-dark" style={{ backgroundColor: "#0F0F0D" }}>
          <div className="container-content" style={{ maxWidth: "860px" }}>
            <AnimateOnScroll style={{ marginBottom: "48px" }}>
              <p
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#1B5E3B",
                  marginBottom: "12px",
                }}
              >
                06 — Tool
              </p>
              <h2 className="type-h2" style={{ color: "#FFFFFF", marginBottom: "16px" }}>
                See exactly how much your savings are losing.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "17px",
                  color: "#888884",
                  lineHeight: "1.65",
                  maxWidth: "560px",
                }}
              >
                Enter your balance. Choose a timeframe. The Naira Erosion
                Calculator shows you the real value of your money after
                inflation, in naira, not percentages.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={120} variant="scale">
              <ErosionCalculator />
            </AnimateOnScroll>
            <p style={{ marginTop: "24px", textAlign: "center" }}>
              <Link
                href="/tools/naira-erosion-calculator"
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  color: "#1B5E3B",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open full calculator &rarr;
              </Link>
            </p>
          </div>
        </section>

      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
