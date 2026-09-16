import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use | NairaSavvy",
  description: "The terms and conditions governing your use of NairaSavvy.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    heading: "Acceptance of terms",
    body: `By accessing or using NairaSavvy, you agree to be bound by these Terms of Use. If you do not agree, please do not use the site. We may revise these terms at any time and your continued use constitutes acceptance of any changes.`,
  },
  {
    heading: "Information only — not financial advice",
    body: `NairaSavvy is a financial education and information platform. Nothing on this site constitutes financial advice, investment advice, legal advice, or any other form of regulated advice. The information provided is for general educational purposes only. Always verify current rates directly with financial institutions and consult a qualified financial advisor before making any investment or financial decision.`,
  },
  {
    heading: "Accuracy of information",
    body: `We make every effort to ensure the accuracy and currency of the information on NairaSavvy, including APY rates, regulatory information, and financial data. However, rates and regulations change frequently. We cannot guarantee that all information is accurate, complete, or current at the time you read it. We accept no liability for decisions made based on information published on this site.`,
  },
  {
    heading: "Affiliate relationships",
    body: `NairaSavvy may earn affiliate commissions when you sign up for financial products through links on this site. These relationships are always clearly disclosed. Affiliate arrangements do not influence our editorial judgement or the accuracy of the information we publish. We only feature products we have independently evaluated as genuinely useful.`,
  },
  {
    heading: "Intellectual property",
    body: `All content on NairaSavvy, including articles, tools, data, and design, is the property of KwenuAI and is protected by applicable copyright law. You may not reproduce, distribute, or create derivative works from our content without prior written permission. You may share links to our content freely.`,
  },
  {
    heading: "Third-party links",
    body: `NairaSavvy contains links to third-party websites, including banks, fintechs, regulators, and news sources. We are not responsible for the content, accuracy, or privacy practices of any linked site. Links do not imply endorsement.`,
  },
  {
    heading: "Limitation of liability",
    body: `To the fullest extent permitted by applicable law, KwenuAI and NairaSavvy shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of this site or reliance on information published here, including but not limited to financial losses resulting from investment decisions.`,
  },
  {
    heading: "Governing law",
    body: `These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from your use of NairaSavvy shall be subject to the exclusive jurisdiction of the courts of Nigeria.`,
  },
  {
    heading: "Contact",
    body: `For any questions about these terms, contact us at hello@nairasavvy.ng.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <section
          id="hero-sentinel"
          style={{
            padding: "100px 24px 80px",
            borderBottom: "1px solid #D4CFC8",
          }}
        >
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <span
              className="category-tag"
              style={{ marginBottom: "20px", display: "inline-block" }}
            >
              Legal
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "16px" }}
            >
              Terms of Use
            </h1>
            <p
              className="type-body"
              style={{ color: "#6B6560", fontSize: "16px" }}
            >
              Effective date: 1 April 2026. NairaSavvy is operated by KwenuAI.
            </p>
          </div>
        </section>

        <article style={{ padding: "64px 24px 120px" }}>
          <div className="container-content" style={{ maxWidth: "760px" }}>
            {sections.map((s) => (
              <div key={s.heading} style={{ marginBottom: "48px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#1A1A1A",
                    marginBottom: "16px",
                  }}
                >
                  {s.heading}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-sans, system-ui, sans-serif)",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#1A1A1A",
                    margin: 0,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
