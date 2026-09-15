import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "Editorial and comparison policy",
  alternates: { canonical: "/editorial-policy" },
};
export default function Page() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content" style={{ maxWidth: 800 }}>
            <h1 className="type-h1">Information you can check.</h1>
            <p>
              Our comparisons show sources and review dates. Missing or older
              records are labelled, and they do not receive an inflation
              verdict.
            </p>
            <h2>How comparisons work</h2>
            <p>
              Naira and dollar products are separated. Annual real-return
              estimates assume a constant NGN yield and inflation rate; they do
              not include unspecified taxes or fees. Data-plan rankings use
              ordinary GB per ₦1,000 by default. Documented restricted bonuses
              are opt-in.
            </p>
            <h2>Review windows</h2>
            <p>
              Rates and data plans need review after 30 days. An inflation
              reference must have a source link and have been recorded within 60
              days. These windows are editorial checks, not guarantees that
              providers have not changed their terms.
            </p>
            <h2>Articles and corrections</h2>
            <p>
              Time-sensitive legacy articles awaiting source checks are marked
              as archived and excluded from search-engine indexing. A correction
              updates the article date; it does not imply that every other claim
              has been reverified.
            </p>
            <h2>Editorial independence</h2>
            <p>
              Any paid placement or affiliate link must be labelled. Payment
              must not determine comparison rankings. Research assistance does
              not replace source checking and editorial review.
            </p>
            <h2>Report a problem</h2>
            <p>
              Found an incorrect rate or claim? Include the page address and a
              primary source when{" "}
              <a href="https://github.com/nels0ncod3s/NairaSavvy/issues">
                reporting an issue
              </a>
              . Do not include private financial details in a public report.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
