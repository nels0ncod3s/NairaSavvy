import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { getHiddenDeals, getAllDataPlans } from "@/lib/data/data-plans"
import DataPlansClient from "./DataPlansClient"

export const metadata: Metadata = {
  title: "Best Data Plans in Nigeria 2026",
  description:
    "Compare mobile data plans from MTN, Airtel, Glo, and T2 Mobile. Find hidden deals and the best value for your money.",
  alternates: { canonical: "/cut-costs/data-plans" },
  openGraph: {
    title: "Best Data Plans in Nigeria 2026 | NairaSavvy",
    description:
      "Compare 36 data plans and find hidden deals from all Nigerian networks.",
    url: "/cut-costs/data-plans",
  },
}

export default async function DataPlansPage() {
  const [hiddenDeals, allPlans] = await Promise.all([
    getHiddenDeals(),
    getAllDataPlans(),
  ])

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        {/* Hero */}
        <section
          id="hero-sentinel"
          style={{ backgroundColor: "#F5F0E8", padding: "100px 24px 80px" }}
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
              Stop overpaying for data. Here are the plans that actually give you value.
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
              We compared every active plan from MTN, Airtel, Glo, and T2 Mobile
              and scored them by GB per ₦1,000. The hidden deals are the ones
              the networks bury in fine print.
            </p>
          </div>
        </section>

        {/* Hidden deals + all plans — rendered client-side for interactivity */}
        <DataPlansClient hiddenDeals={hiddenDeals} allPlans={allPlans} />

        {/* CTA */}
        <section style={{ padding: "80px 24px", backgroundColor: "#0F0F0D" }}>
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
