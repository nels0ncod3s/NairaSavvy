import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import ArticleGrid from "@/components/ArticleGrid";
import NairaGuardDashboard from "@/components/home/NairaGuardDashboard";
import InflationCalculator from "@/components/tools/InflationCalculator";
import { Suspense } from "react";
import DataLoading from "@/components/DataLoading";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Compare savings and purchasing power",
  description:
    "Compare currencies, yields, access terms and verification dates before choosing a savings product.",
  alternates: { canonical: "/savings" },
};
export default function SavingsPage() {
  return (
    <>
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
            <Suspense fallback={<DataLoading />}>
              <NairaGuardDashboard />
            </Suspense>
          </div>
        </section>
        <section className="ns-section">
          <div className="container-content">
            <Suspense fallback={<DataLoading />}>
              <InflationCalculator />
            </Suspense>
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
