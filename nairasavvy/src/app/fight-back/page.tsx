import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Fight Back Against Banks and Bad Systems",
  description:
    "Know your rights as a Nigerian bank customer. Templates, guides, and tools to resolve disputes, file CBN complaints, and hold banks accountable.",
  alternates: { canonical: "/fight-back" },
  openGraph: {
    title: "Fight Back Against Banks and Bad Systems | NairaSavvy",
    description: "Know your rights. Use them.",
    url: "/fight-back",
  },
};

export default function FightBackPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        <section id="hero-sentinel" style={{ backgroundColor: "#F5F0E8", padding: "100px 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span className="category-tag" style={{ marginBottom: "20px", display: "inline-block" }}>Fight Back</span>
            <h1 className="type-h1" style={{ color: "#1A1A1A", marginBottom: "24px" }}>Know your rights. Use them.</h1>
            <p className="type-body" style={{ color: "#6B6560", maxWidth: "600px", marginBottom: "0", fontSize: "18px", lineHeight: "1.7" }}>
              Nigerian banks rely on you not knowing the rules. Failed transactions, mystery charges, locked accounts, and debit card fraud \u2014 you have legal rights in every case.
            </p>
          </div>
        </section>
        <section style={{ padding: "0 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <div style={{ backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", padding: "32px" }}>
              <p className="type-body" style={{ color: "#1A1A1A", margin: 0, lineHeight: "1.8" }}>
                The Central Bank of Nigeria&apos;s Consumer Protection Regulations (2022) give you clear rights as a bank customer. Banks are required to resolve failed transaction disputes within <strong>72 hours</strong>, provide refunds for erroneous charges, and respond to CBN complaints within <strong>5 business days</strong>.
              </p>
            </div>
          </div>
        </section>
        <section style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "40px" }}>Tools</h2>
            <div style={{ backgroundColor: "#FAFAF7", border: "1px solid #D4CFC8", borderRadius: "4px", padding: "40px", maxWidth: "560px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "#1B5E3B", color: "#FFFFFF", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: "2px" }}>Coming Soon</div>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>\u2709\uFE0F</div>
              <h3 className="type-h3" style={{ color: "#1A1A1A", marginBottom: "12px", fontFamily: "var(--font-serif, Georgia, serif)" }}>Complaint Letter Generator</h3>
              <p className="type-body" style={{ color: "#6B6560", marginBottom: "24px" }}>Generate a legally-worded complaint letter to your bank or the CBN in under 2 minutes. Include the right regulation citations, demand a resolution timeline, and escalate through the correct channels.</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {["Failed POS", "USSD failure", "Erroneous charges", "Locked account", "Device policy"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "12px", fontWeight: 500, color: "#6B6560", backgroundColor: "#F5F0E8", border: "1px solid #D4CFC8", padding: "4px 10px", borderRadius: "2px" }}>{tag}</span>
                ))}
              </div>
              <button disabled style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#D4CFC8", color: "#9CA3A0", fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "15px", fontWeight: 600, padding: "14px 24px", borderRadius: "4px", border: "none", cursor: "not-allowed" }}>
                Generate Letter \u2014 Coming Soon
              </button>
            </div>
          </div>
        </section>
        <section style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: "#1A1A1A", marginBottom: "40px" }}>Fight Back Guides</h2>
            <ArticleGrid category="fight-back" />
          </div>
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
