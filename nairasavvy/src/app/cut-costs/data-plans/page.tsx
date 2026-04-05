import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getHiddenDeals, getTopPlansPerNetwork, getAllDataPlans } from "@/lib/data/data-plans"
import DataPlansClient from "./DataPlansClient"

export const metadata: Metadata = {
  title: "Best Data Plans in Nigeria",
  description:
    "Compare mobile data plans from MTN, Airtel, Glo, and 9mobile. Find hidden deals and the best value for your money.",
  alternates: { canonical: "/cut-costs/data-plans" },
  openGraph: {
    title: "Best Data Plans in Nigeria | NairaSavvy",
    description:
      "Compare mobile data plans and find hidden deals from all Nigerian networks.",
    url: "/cut-costs/data-plans",
  },
}

export default async function DataPlansPage() {
  const [hiddenDeals, topPlans, allPlans] = await Promise.all([
    getHiddenDeals(),
    getTopPlansPerNetwork(),
    getAllDataPlans(),
  ])

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
              Cut Costs
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              Stop overpaying for data. These plans give you more.
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
              We tracked every data plan from MTN, Airtel, Glo, and 9mobile to
              find the ones that actually give you value. No fluff, just the
              best deals.
            </p>
          </div>
        </section>

        {/* Hidden Deals Section */}
        {hiddenDeals.length > 0 && (
          <section
            style={{
              padding: "0 24px 80px",
              backgroundColor: "#0F0F0D",
            }}
          >
            <div className="container-content">
              <h2
                className="type-h2"
                style={{ color: "#FFFFFF", marginBottom: "8px" }}
              >
                Hidden Deals
              </h2>
              <p
                className="type-body"
                style={{ color: "#888884", marginBottom: "32px" }}
              >
                Secret plans most people do not know about. Copy the code and
                dial to activate.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {hiddenDeals.map((deal) => (
                  <div
                    key={deal.id}
                    style={{
                      backgroundColor: "#1C1C1A",
                      border: "1px solid #333331",
                      borderRadius: "4px",
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#1B5E3B",
                            backgroundColor: "#E8F5EE",
                            padding: "3px 8px",
                            borderRadius: "2px",
                          }}
                        >
                          {deal.network}
                        </span>
                        <h3
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            margin: "12px 0 4px",
                          }}
                        >
                          {deal.plan_name}
                        </h3>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "12px",
                            color: "#888884",
                            margin: "0 0 4px",
                          }}
                        >
                          Data
                        </p>
                        <p
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                          }}
                        >
                          {deal.data_gb}GB
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "12px",
                            color: "#888884",
                            margin: "0 0 4px",
                          }}
                        >
                          Price
                        </p>
                        <p
                          style={{
                            fontFamily:
                              "var(--font-sans, system-ui, sans-serif)",
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                          }}
                        >
                          &#8358;{deal.price_naira.toLocaleString()}
                        </p>
                      </div>
                      {deal.night_bonus_gb > 0 && (
                        <div>
                          <p
                            style={{
                              fontFamily:
                                "var(--font-sans, system-ui, sans-serif)",
                              fontSize: "12px",
                              color: "#888884",
                              margin: "0 0 4px",
                            }}
                          >
                            Night Bonus
                          </p>
                          <p
                            style={{
                              fontFamily:
                                "var(--font-sans, system-ui, sans-serif)",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#1B5E3B",
                              margin: 0,
                            }}
                          >
                            +{deal.night_bonus_gb}GB
                          </p>
                        </div>
                      )}
                    </div>
                    {deal.activation_code && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#0F0F0D",
                          border: "1px solid #333331",
                          borderRadius: "4px",
                          padding: "10px 12px",
                        }}
                      >
                        <code
                          style={{
                            fontFamily: "monospace",
                            fontSize: "14px",
                            color: "#FFFFFF",
                            flex: 1,
                          }}
                        >
                          {deal.activation_code}
                        </code>
                        <button
                          className="btn-primary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                          }}
                          onClick={() => {
                            if (typeof navigator !== "undefined") {
                              navigator.clipboard.writeText(deal.activation_code ?? "")
                            }
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Client-side Plans Grid */}
        <DataPlansClient allPlans={allPlans} />

        {/* CTA */}
        <section
          style={{
            padding: "80px 24px",
            backgroundColor: "#0F0F0D",
          }}
        >
          <div
            className="container-content"
            style={{ maxWidth: "600px", textAlign: "center" }}
          >
            <h2
              className="type-h2"
              style={{ color: "#FFFFFF", marginBottom: "16px" }}
            >
              Want more ways to save?
            </h2>
            <p
              className="type-body"
              style={{ color: "#888884", marginBottom: "32px" }}
            >
              Get alerts when new deals drop. No spam, just savings.
            </p>
            <a href="/newsletter" className="btn-primary">
              Get Free Alerts &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
