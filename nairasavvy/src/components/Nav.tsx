"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Savings", href: "/savings" },
  { label: "Fight Back", href: "/fight-back" },
  { label: "Grow", href: "/grow" },
  { label: "Cut Costs", href: "/cut-costs" },
  { label: "Articles", href: "/articles" },
];

export default function Nav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── Floating pill nav ─────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          /* Never wider than viewport minus 32px gutter */
          width: "min(calc(100% - 32px), 1248px)",
          zIndex: 9999,
          backgroundColor: "rgba(15, 15, 13, 0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "100px",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)"
            : "0 4px 20px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.10)",
          transition: "box-shadow 0.35s ease",
        } as React.CSSProperties}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
            padding: "0 8px 0 24px",
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="NairaSavvy home"
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#FFFFFF",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            NairaSavvy
          </Link>

          {/* Desktop links — hidden on mobile */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "24px" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.72)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                className="hover:!text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA — pill-shaped button */}
          <div className="hidden md:flex" style={{ alignItems: "center" }}>
            <Link
              href="/newsletter"
              style={{
                fontFamily: "var(--font-sans, system-ui, sans-serif)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                backgroundColor: "#1B5E3B",
                textDecoration: "none",
                padding: "10px 22px",
                borderRadius: "100px",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s ease, transform 0.15s ease",
                display: "inline-block",
              }}
              className="hover:!bg-green-700"
            >
              Get Free Alerts
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              color: "#FFFFFF",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          backgroundColor: "#0F0F0D",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px 36px",
          transform: isMobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Overlay header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
            marginBottom: "32px",
          }}
        >
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            NairaSavvy
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "none",
              cursor: "pointer",
              padding: "10px",
              color: "#FFFFFF",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link) => (
              <li
                key={link.href}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontSize: "clamp(22px, 6vw, 28px)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    padding: "18px 0",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile CTA */}
        <div>
          <Link
            href="/newsletter"
            onClick={() => setIsMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#1B5E3B",
              textDecoration: "none",
              padding: "16px 24px",
              borderRadius: "100px",
              transition: "background-color 0.2s ease",
            }}
          >
            Get Free Alerts &rarr;
          </Link>
          <p
            style={{
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: "13px",
              color: "#4A4845",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            Free forever · No spam
          </p>
        </div>
      </div>

      {/* Spacer: pill top (12px) + pill height (56px) + breathing room (12px) */}
      <div style={{ height: "80px" }} aria-hidden="true" />
    </>
  );
}
