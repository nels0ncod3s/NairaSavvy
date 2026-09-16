import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | NairaSavvy",
  description:
    "How NairaSavvy collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    heading: "What we collect",
    body: `When you subscribe to the Naira Shield newsletter, we collect your email address and the page you signed up from. We do not collect your name, phone number, financial account details, or any other personal information unless you voluntarily provide it when contacting us.`,
  },
  {
    heading: "How we use your information",
    body: `Your email address is used solely to send you the Naira Shield newsletter and occasional product updates related to NairaSavvy. We do not sell, rent, or share your email address with any third party for marketing purposes.`,
  },
  {
    heading: "Service providers",
    body: `Supabase stores subscription records and SendByte processes confirmation email delivery. Complaint-letter details stay in your browser and are not submitted to these services.`,
  },
  {
    heading: "Cookies and analytics",
    body: `NairaSavvy uses Vercel Analytics, a privacy-first analytics tool that does not use cookies or track you across websites. We collect aggregate, anonymised page view data to understand which content is most useful. No personally identifiable information is collected through analytics.`,
  },
  {
    heading: "Affiliate links",
    body: `Some links on NairaSavvy may be affiliate links, meaning we may earn a small commission if you sign up for a product through our link. This never affects our editorial independence. Affiliate relationships are always clearly labelled. We only recommend products we have independently evaluated.`,
  },
  {
    heading: "Data retention",
    body: `Your email address and signup status are stored to manage your subscription. Confirmation links expire after 24 hours. Completing the unsubscribe form removes your subscriber record. Delivery providers may retain their own operational logs.`,
  },
  {
    heading: "Your rights",
    body: `You have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, email us at hello@nairasavvy.ng and we will respond within 14 days.`,
  },
  {
    heading: "Changes to this policy",
    body: `We may update this policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of NairaSavvy after changes are posted constitutes your acceptance of the revised policy.`,
  },
];

export default function PrivacyPage() {
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
              Privacy Policy
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
