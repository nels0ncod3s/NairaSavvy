import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About NairaSavvy",
  description:
    "NairaSavvy is Nigeria's consumer financial intelligence platform. We track rates, translate CBN policy, and give everyday Nigerians the same tools the system was never designed to give them.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About NairaSavvy",
    description: "Nigeria's consumer financial intelligence platform \u2014 built for everyday Nigerians.",
    url: "/about",
  },
};

const pillars = [
  { icon: "\uD83D\uDEE1\uFE0F", title: "Protect Your Savings", description: "Track inflation vs. your savings rate. We show you exactly how much your naira loses every month \u2014 and which accounts are actually keeping pace.", href: "/savings" },
  { icon: "\u26A1", title: "Fight Back", description: "Banks make mistakes. Merchants overcharge. Know your rights under CBN consumer protection guidelines \u2014 and use them.", href: "/fight-back" },
  { icon: "\uD83D\uDCC8", title: "Grow What You Have", description: "T-bills, dollar accounts, mutual funds \u2014 explained in plain English, with real numbers for everyday Nigerians.", href: "/grow" },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        <section id="hero-sentinel" style={{ backgroundColor: "#F5F0E8", padding: "100px 24px 80px", borderBottom: "1px solid #D4CFC8" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span className="category-tag" style={{ marginBottom: "20px", display: "inline-block" }}>About</span>
            <h1 className="type-h1" style={{ color: "#1A1A1A", marginBottom: "24px" }}>Built for the Nigerian who the system forgot to include.</h1>
          </div>
        </section>
        <section style={{ padding: "80px 24px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "24px" }}>Who we are</h2>
            <p className="type-body" style={{ color: "#1A1A1A", lineHeight: "1.8", fontSize: "18px" }}>
              NairaSavvy is Nigeria&apos;s consumer financial intelligence platform. We track rates, translate CBN policy, and give everyday Nigerians the same tools the system was never designed to give them.
            </p>
            <p className="type-body" style={{ color: "#6B6560", lineHeight: "1.8", marginTop: "16px" }}>
              We&apos;re not a bank. We&apos;re not a broker. We have no financial product to sell you. We exist to give you the intelligence you need to make better decisions with your money.
            </p>
          </div>
        </section>
        <section style={{ padding: "0 24px 80px", backgroundColor: "#F5F0E8" }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "40px" }}>What we do</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {pillars.map((pillar) => (
                <Link key={pillar.href} href={pillar.href} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ borderRadius: "4px", padding: "40px 32px", height: "100%" }}>
                    <div style={{ fontSize: "32px", marginBottom: "20px" }}>{pillar.icon}</div>
                    <h3 className="type-h3" style={{ color: "#1A1A1A", marginBottom: "12px", fontFamily: "var(--font-serif, Georgia, serif)" }}>{pillar.title}</h3>
                    <p className="type-body" style={{ color: "#6B6560", margin: 0 }}>{pillar.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section style={{ padding: "80px 24px", backgroundColor: "#FAFAF7", borderTop: "1px solid #D4CFC8", borderBottom: "1px solid #D4CFC8" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "24px" }}>Editorial standards</h2>
            <p className="type-body" style={{ color: "#1A1A1A", lineHeight: "1.8", fontSize: "18px", marginBottom: "16px" }}>
              Every article is verified before publication. We cite our sources. We flag what we&apos;re unsure about. We update articles when things change.
            </p>
            <p className="type-body" style={{ color: "#6B6560", lineHeight: "1.8" }}>
              We don&apos;t publish clickbait. We don&apos;t run unverified rumours. When we get something wrong, we publish a correction and update the article.
            </p>
          </div>
        </section>
        <section style={{ padding: "80px 24px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "24px" }}>Disclaimer</h2>
            <div style={{ backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", padding: "32px" }}>
              <p className="type-body" style={{ color: "#6B6560", lineHeight: "1.8", margin: 0 }}>
                <strong style={{ color: "#1A1A1A" }}>NairaSavvy is a financial education and information platform.</strong>{" "}
                Nothing on this site constitutes financial advice. Always verify current rates and consult a qualified financial advisor before making investment decisions. We may earn affiliate commissions from some links \u2014 these are always clearly labelled. APY rates shown are for informational purposes only and may have changed since last verified. Past performance does not guarantee future returns. NairaSavvy is not regulated by the CBN or the SEC.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
