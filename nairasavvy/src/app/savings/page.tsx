import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import ArticleGrid from "@/components/ArticleGrid";
import NairaGuardDashboard from "@/components/home/NairaGuardDashboard";
import ErosionCalculator from "@/components/tools/ErosionCalculator";
import { getCurrentInflationRate } from "@/lib/data/inflation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Compare savings and purchasing power",
  description:
    "Compare currencies, yields, access terms and verification dates before choosing a savings product.",
  alternates: { canonical: "/savings" },
};
export default async function SavingsPage() {
  const inflation = await getCurrentInflationRate();
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content">
            <span className="category-tag">Savings & yields</span>
            <h1 className="type-h1">Give your savings a fair comparison.</h1>
            <p>
              Look beyond the headline rate. Currency, access, fees and risk all
              matter.
            </p>
          </div>
        </section>
        <section className="ns-section">
          <div className="container-content">
            <NairaGuardDashboard />
          </div>
        </section>
        <section className="ns-section">
          <div className="container-content">
            <ErosionCalculator
              initialInflationRate={inflation?.rate_percent}
              inflationPeriod={inflation?.period}
              inflationSource={inflation?.source}
            />
          </div>
        </section>
        <section className="ns-section">
          <div className="container-content">
            <h2 className="type-h2">Savings guides</h2>
            <ArticleGrid category="savings" />
          </div>
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
