"use client";

import { useState, useEffect, useRef } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "#0F0F0D",
        padding: "80px 24px",
        opacity: 0,
        transform: "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="container-content"
        style={{ maxWidth: "640px", textAlign: "center" }}
      >
        <p
          className="type-label"
          style={{ color: "#1B5E3B", marginBottom: "16px" }}
        >
          The Naira Shield
        </p>
        <h2
          className="type-h2"
          style={{
            color: "#FFFFFF",
            marginBottom: "16px",
          }}
        >
          Free weekly financial intelligence for Nigerians
        </h2>
        <p
          className="type-body"
          style={{
            color: "#9CA3A0",
            marginBottom: "40px",
          }}
        >
          Every week: the best rates, bank alerts, your consumer rights, and
          the moves smart Nigerians are making. Free forever.
        </p>

        {state === "success" ? (
          <div
            style={{
              backgroundColor: "#E8F5EE",
              border: "1px solid #1B5E3B",
              borderRadius: "4px",
              padding: "20px 24px",
            }}
          >
            <p style={{ color: "#1B5E3B", fontWeight: 600, margin: 0 }}>
              ✓ You&apos;re on the list. Check your inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              className="input-dark"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: "1 1 280px",
                maxWidth: "320px",
                backgroundColor: "#1C1C1A",
                borderColor: "#333331",
                color: "#FFFFFF",
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={state === "loading"}
              style={{ whiteSpace: "nowrap" }}
            >
              {state === "loading" ? "Joining..." : "Get Free Alerts →"}
            </button>
          </form>
        )}

        {state === "error" && (
          <p style={{ color: "#E8A87C", marginTop: "12px", fontSize: "14px" }}>
            Something went wrong. Please try again.
          </p>
        )}

        <p
          style={{
            color: "#4A4845",
            fontSize: "13px",
            marginTop: "16px",
          }}
        >
          Free forever · No spam · Unsubscribe anytime
        </p>
      </div>
    </section>
  );
}
