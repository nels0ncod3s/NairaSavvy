import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import ArticleGrid from "@/components/ArticleGrid"
import NewsletterCTA from "@/components/NewsletterCTA"
import { getCurrentInflationRate } from "@/lib/data/inflation"
import { getAllAPYRates, type APYRate } from "@/lib/data/apy-rates"
import ErosionCalculator from "@/components/tools/ErosionCalculator"

export const metadata: Metadata = {
  title: "Protect Your Savings From Inflation",
  description:
    "Track real savings rates vs. Nigeria's inflation. See which banks and fintechs are actually growing your money, updated monthly.",
  alternates: { canonical: "/savings" },
  openGraph: {
    title: "Protect Your Savings From Inflation | NairaSavvy",
    description:
      "See which savings accounts beat Nigeria's inflation, and which ones are quietly destroying your money.",
    url: "/savings",
  },
}

const TYPE_LABELS: Record<string, string> = {
  savings: "Bank",
  neobank: "Neobank",
  wealthtech: "Wealthtech",
}

function VerdictBadge({ verdict }: { verdict: APYRate["verdict"] }) {
  const styles: Record<APYRate["verdict"], { bg: string; text: string }> = {
    "BEATS INFLATION": { bg: "#E8F5EE", text: "#1B5E3B" },
    CLOSE: { bg: "#FFFBEB", text: "#78350F" },
    "LOSING VALUE": { bg: "#FEF2F2", text: "#7F1D1D" },
  }
  const style = styles[verdict]
  return (
    <span
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: style.text,
        backgroundColor: style.bg,
        padding: "4px 10px",
        borderRadius: "2px",
        whiteSpace: "nowrap",
      }}
    >
      {verdict}
    </span>
  )
}

export default async function SavingsPage() {
  const inflation = await getCurrentInflationRate()
  const inflationRate = inflation?.rate_percent ?? 15.06
  const inflationPeriod = inflation?.period ?? ""
  const inflationSource = inflation?.source ?? ""

  const allRates = await getAllAPYRates(inflationRate)

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
              Savings & Yields
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              Your &#8358;100,000 is worth less than it was yesterday. Here's
              how to stop the bleed.
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
              Nigeria's inflation is running at{" "}
              <strong style={{ color: "#1A1A1A" }}>{inflationRate}%</strong>{" "}
              ({inflationSource}, {inflationPeriod}). If your savings account
              isn't beating that, you're losing money in slow motion.
              Here's what's actually worth your time.
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
                marginBottom: "48px",
              }}
            >
              <p
                className="type-body"
                style={{ color: "#1A1A1A", margin: 0, lineHeight: "1.8" }}
              >
                Most Nigerian savings accounts pay between 4-8% APY. With
                inflation at {inflationRate}%, every naira sitting in a standard
                savings account is losing{" "}
                <strong>
                  at least {(inflationRate - 8).toFixed(0)}% of its real value
                  every year
                </strong>
                . The good news: some fintechs and specialised bank products are
                paying significantly more. This dashboard tracks them.
              </p>
            </div>

            {/* Erosion Calculator */}
            <ErosionCalculator
              initialInflationRate={inflationRate}
              inflationPeriod={inflationPeriod}
              inflationSource={inflationSource}
            />
          </div>
        </section>

        {/* NairaGuard APY Table */}
        <section id="naira-guard" className="ns-section">
          <div className="container-content">
            <div style={{ marginBottom: "40px" }}>
              <h2
                className="type-h2"
                style={{ color: "#1A1A1A", marginBottom: "8px" }}
              >
                NairaGuard Dashboard
              </h2>
              <p className="type-body" style={{ color: "#6B6560" }}>
                Current savings rates vs. inflation.{" "}
                <strong style={{ color: "#1A1A1A" }}>
                  Inflation benchmark: {inflationRate}%
                </strong>
              </p>
            </div>

            {/* Inflation Alert Box */}
            <div
              style={{
                backgroundColor: "#E8F5EE",
                border: "1px solid #1B5E3B",
                borderRadius: "4px",
                padding: "16px 20px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "20px" }}>&#128202;</span>
              <p
                className="type-small"
                style={{ color: "#1B5E3B", margin: 0, lineHeight: "1.5" }}
              >
                <strong>
                  Nigeria's inflation is at {inflationRate}%.
                </strong>{" "}
                Any savings account below this rate is losing real value every
                month.
              </p>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#FAFAF7",
                  border: "1px solid #D4CFC8",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#1A1A1A" }}>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Institution
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Product
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "right",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      APY
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "center",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Verdict
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allRates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "32px 20px",
                          textAlign: "center",
                          color: "#6B6560",
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        }}
                      >
                        No rates data available right now.
                      </td>
                    </tr>
                  ) : (
                    allRates.map((row, i) => (
                      <tr
                        key={`${row.institution}-${row.product_name}`}
                        style={{
                          backgroundColor: i % 2 === 0 ? "#FAFAF7" : "#FFFFFF",
                          borderBottom: "1px solid #D4CFC8",
                        }}
                      >
                        <td
                          style={{
                            padding: "16px 20px",
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#1A1A1A",
                          }}
                        >
                          {row.institution}
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "15px",
                            color: "#6B6560",
                          }}
                        >
                          {row.product_name}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span
                            style={{
                              fontFamily:
                                "var(--font-sans, system-ui, sans-serif)",
                              fontSize: "12px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: "#6B6560",
                              backgroundColor: "#F5F0E8",
                              padding: "3px 8px",
                              borderRadius: "2px",
                            }}
                          >
                            {TYPE_LABELS[row.product_type ?? ""] ??
                              row.product_type}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            textAlign: "right",
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "18px",
                            fontWeight: 700,
                            color:
                              row.vs_inflation >= 0 ? "#1B5E3B" : "#1A1A1A",
                          }}
                        >
                          {row.apy_percent.toFixed(2)}%
                        </td>
                        <td
                          style={{
                            padding: "16px 20px",
                            textAlign: "center",
                          }}
                        >
                          <VerdictBadge verdict={row.verdict} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {allRates.length > 0 && (
                  <tfoot>
                    <tr
                      style={{
                        backgroundColor: "#1A1A1A",
                        color: "#FFFFFF",
                      }}
                    >
                      <td
                        colSpan={3}
                        style={{
                          padding: "16px 20px",
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Summary
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          textAlign: "right",
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {allRates.filter((r) => r.vs_inflation >= 0).length} of{" "}
                        {allRates.length} beat inflation
                      </td>
                      <td style={{ padding: "16px 20px" }}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <p
              className="type-small"
              style={{
                color: "#9CA3A0",
                marginTop: "16px",
              }}
            >
              Rates are for informational purposes only. Always verify current
              rates directly with the institution before making any financial
              decision.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="ns-section" style={{ backgroundColor: "#F5F0E8" }}>
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Savings Guides
            </h2>
            <ArticleGrid category="savings" />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  )
}
