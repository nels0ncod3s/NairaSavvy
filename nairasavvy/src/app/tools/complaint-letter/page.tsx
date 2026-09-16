import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ComplaintLetter from "@/components/tools/ComplaintLetter";
export const metadata: Metadata = {
  title: "Bank complaint letter generator",
  description: "Draft, edit and download a complaint letter in your browser.",
  alternates: { canonical: "/tools/complaint-letter" },
};
export default function Page() {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content" style={{ maxWidth: 900 }}>
            <span className="category-tag">Fight Back · Free tool</span>
            <h1 className="type-h1">
              Turn the problem into a clear complaint.
            </h1>
            <p>
              Write down what happened, the evidence you have, and the
              resolution you want.
            </p>
            <ComplaintLetter />
            <section className="tool-panel" style={{ marginTop: 32 }}>
              <h2 className="type-h3">After sending</h2>
              <p>
                Complain to your institution first and retain its reference. CBN
                guidance describes escalation after two weeks unresolved, or 30
                days for excess-charge and loan complaints. Specific rules can
                differ by issue; confirm the applicable process.
              </p>
              <p>
                For suspected fraud, contact your bank immediately rather than
                waiting.
              </p>
              <p>
                Guidance checked 14 September 2026:{" "}
                <a
                  href="https://www.cbn.gov.ng/FinInc/FinLit/LodgeComplaint.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CBN complaint procedure
                </a>{" "}
                ·{" "}
                <a
                  href="https://www.cbn.gov.ng/FinInc/FinLit/BillOfRights.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Customer rights and duties
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
