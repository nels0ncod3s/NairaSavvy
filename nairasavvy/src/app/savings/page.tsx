import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Protect Your Savings From Inflation",
  description:
    "Track real savings rates vs. Nigeria's inflation. See which banks and fintechs are actually growing your money \u2014 updated monthly.",
  alternates: { canonical: "/savings" },
  openGraph: {
    title: "Protect Your Savings From Inflation | NairaSavvy",
    description:
      "See which savings accounts beat Nigeria's 32.7% inflation \u2014 and which ones are quietly destroying your money.",
    url: "/savings",
  },
};

const APY_RATES = [
  { institution: "Lotus Bank", product: "Fixed Deposit", type: "savings", apy: 22.0 },
  { institution: "Kuda Bank", product: "High Yield Save", type: "neobank", apy: 15.0 },
  { institution: "OPay", product: "Savings", type: "neobank", apy: 15.0 },
  { institution: "Moniepoint", product: "Business Save", type: "neobank", apy: 14.0 },
  { institution: "PiggyVest", product: "SafeLock", type: "wealthtech", apy: 13.0 },
  { institution: "Access Bank", product: "PayDay Save", type: "savings", apy: 8.0 },
  { institution: "GTBank", product: "Smart Save", type: "savings", apy: 8.5 },
  { institution: "Cowrywise", product: "Dollar Fund", type: "wealthtech", apy: 6.5 },
  { institution: "PiggyVest", product: "Flex Dollar", type: "wealthtech", apy: 7.0 },
  { institution: "Zenith Bank", product: "Target Save", type: "savings", apy: 6.0 },
];

const INFLATION_RATE = 32.7;

const TYPE_LABELS: Record<string, string> = {
  savings: "Bank",
  neobank: "Neobank",
  wealthtech: "Wealthtech",
};

export default function SavingsPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        <section id="hero-sentinel" style={{ backgroundColor: "#F5F0E8", padding: "100px 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span className="category-tag" style={{ marginBottom: "20px", display: "inline-block" }}>Savings &amp; Yields</span>
            <h1 className="type-h1" style={{ color: "#1A1A1A", marginBottom: "24px" }}>
              Your \u20a6100,000 is worth less than it was yesterday. Here&apos;s how to stop the bleed.
            </h1>
            <p className="type-body" style={{ color: "#6B6560", maxWidth: "600px", marginBottom: "0", fontSize: "18px", lineHeight: "1.7" }}>
              Nigeria&apos;s inflation is running at{" "}
              <strong style={{ color: "#1A1A1A" }}>{INFLATION_RATE}%</strong>{" "}
              (NBS, March 2026). If your savings account isn&apos;t beating that, you&apos;re losing money in slow motion.
            </p>
          </div>
        </section>

        <section style={{ padding: "0 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <div style={{ backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", padding: "32px", marginBottom: "48px" }}>
              <p className="type-body" style={{ color: "#1A1A1A", margin: 0, lineHeight: "1.8" }}>
                Most Nigerian savings accounts pay between 4\u20138% APY. With inflation at {INFLATION_RATE}%, every naira sitting in a standard savings account is losing{" "}
                <strong>at least 24% of its real value every year</strong>. The good news: some fintechs and specialised bank products are paying significantly more. This dashboard tracks them.
              </p>
            </div>
          </div>
        </section>

        <section id="naira-guard" style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <div style={{ marginBottom: "40px" }}>
              <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "8px" }}>NairaGuard Dashboard</h2>
              <p className="type-body" style={{ color: "#6B6560" }}>
                Current savings rates vs. inflation. Last verified March 2026.{" "}
                <strong style={{ color: "#1A1A1A" }}>Inflation benchmark: {INFLATION_RATE}%</strong>
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ backgroundColor: "#1A1A1A" }}>
                    {["Institution", "Product", "Type", "APY", "Beats Inflation?"].map((h, idx) => (
                      <th key={h} style={{ padding: "16px 20px", textAlign: idx === 3 ? "right" : idx === 4 ? "center" : "left", color: "#FFFFFF", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {APY_RATES.sort((a, b) => b.apy - a.apy).map((row, i) => {
                    const beats = row.apy >= INFLATION_RATE;
                    return (
                      <tr key={`${row.institution}-${row.product}`} style={{ backgroundColor: i % 2 === 0 ? "#FAFAF7" : "#FFFFFF", borderBottom: "1px solid #D4CFC8" }}>
                        <td style={{ padding: "16px 20px", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>{row.institution}</td>
                        <td style={{ padding: "16px 20px", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "15px", color: "#6B6560" }}>{row.product}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6B6560", backgroundColor: "#F5F0E8", padding: "3px 8px", borderRadius: "2px" }}>{TYPE_LABELS[row.type] ?? row.type}</span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "18px", fontWeight: 700, color: beats ? "#1B5E3B" : "#1A1A1A" }}>{row.apy.toFixed(2)}%</td>
                        <td style={{ padding: "16px 20px", textAlign: "center", fontSize: "18px" }}>{beats ? "\u2713" : "\u2717"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="type-small" style={{ color: "#9CA3A0", marginTop: "16px" }}>
              Rates are for informational purposes only. Always verify current rates directly with the institution before making any financial decision.
            </p>
          </div>
        </section>

        <section style={{ padding: "0 24px 100px", backgroundColor: "#F5F0E8" }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "40px" }}>Savings Guides</h2>
            <ArticleGrid category="savings" />
          </div>
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
