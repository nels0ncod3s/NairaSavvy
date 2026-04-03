"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NewsletterClient() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#0F0F0D", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div id="hero-sentinel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px" }}>
          <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "14px", fontWeight: 600, color: "#1B5E3B", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "32px" }}>NairaSavvy</p>
            <h1 className="type-h1" style={{ color: "#FFFFFF", marginBottom: "24px" }}>The Naira Shield</h1>
            <p className="type-body" style={{ color: "#9CA3A0", fontSize: "18px", lineHeight: "1.7", marginBottom: "48px" }}>
              Every week: the best rates, bank alerts, your consumer rights, and the moves smart Nigerians are making.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginBottom: "48px", flexWrap: "wrap" }}>
              {["Free forever", "No spam", "Unsubscribe anytime"].map((t) => (
                <span key={t} style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "14px", color: "#6B6760", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#1B5E3B", fontWeight: 700 }}>✓</span>{t}
                </span>
              ))}
            </div>
            {state === "success" ? (
              <div style={{ backgroundColor: "#0A2E1A", border: "1px solid #1B5E3B", borderRadius: "4px", padding: "32px" }}>
                <p style={{ color: "#4ADE80", fontWeight: 700, fontSize: "18px", margin: 0, marginBottom: "8px" }}>✓ You&apos;re on the list.</p>
                <p style={{ color: "#9CA3A0", margin: 0, fontSize: "15px" }}>Check your inbox for a confirmation email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <input type="email" className="input input-dark" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ flex: "1 1 280px", maxWidth: "340px" }} />
                <button type="submit" className="btn-primary" disabled={state === "loading"} style={{ fontSize: "16px", padding: "14px 28px", whiteSpace: "nowrap" }}>
                  {state === "loading" ? "Joining..." : "Get Free Alerts →"}
                </button>
              </form>
            )}
            {state === "error" && <p style={{ color: "#E8A87C", marginTop: "16px", fontSize: "14px" }}>Something went wrong. Please try again.</p>}
            <div style={{ marginTop: "80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "24px", textAlign: "left" }}>
              {[
                { label: "Best Rates", desc: "Top savings accounts updated weekly" },
                { label: "Bank Alerts", desc: "New policies and charges that affect you" },
                { label: "Your Rights", desc: "Consumer protection tips you can use today" },
                { label: "Smart Moves", desc: "What savvy Nigerians are doing with their money" },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1B5E3B", marginBottom: "8px" }}>{item.label}</p>
                  <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "14px", color: "#6B6760", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
