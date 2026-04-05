"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Savings", href: "/savings" },
  { label: "Fight Back", href: "/fight-back" },
  { label: "Grow", href: "/grow" },
  { label: "Cut Costs", href: "/cut-costs" },
  { label: "Articles", href: "/articles" },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const heroSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Watch the hero section; go solid once hero scrolls out
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) {
      // Fallback: use scroll position
      const handleScroll = () => setIsScrolled(window.scrollY > 80);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: isScrolled ? "#F5F0E8" : "transparent",
          boxShadow: isScrolled ? "0 1px 0 #D4CFC8" : "none",
        }}
        aria-label="Main navigation"
      >
        <div className="container-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "72px",
            }}
          >
            {/* Wordmark */}
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "22px",
                fontWeight: 700,
                color: "#1A1A1A",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
              aria-label="NairaSavvy home"
            >
              NairaSavvy
            </Link>

            {/* Desktop nav links */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
              }}
              className="hidden md:flex"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  className="hover:text-green-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex" style={{ alignItems: "center" }}>
              <Link
                href="/newsletter"
                className="btn-primary"
                style={{ fontSize: "14px", padding: "11px 20px" }}
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
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#1A1A1A",
              }}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        aria-hidden={!isMobileOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          backgroundColor: "#F5F0E8",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          transform: isMobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Mobile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "48px",
          }}
        >
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            style={{
              fontFamily: "var(--font-playfair, Georgia, serif)",
              fontSize: "22px",
              fontWeight: 700,
              color: "#1A1A1A",
              textDecoration: "none",
            }}
          >
            NairaSavvy
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "#1A1A1A",
            }}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  borderBottom: "1px solid #D4CFC8",
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-playfair, Georgia, serif)",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    textDecoration: "none",
                    padding: "20px 0",
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
        <div style={{ paddingTop: "32px" }}>
          <Link
            href="/newsletter"
            className="btn-primary"
            onClick={() => setIsMobileOpen(false)}
            style={{ width: "100%", justifyContent: "center" }}
          >
            Get Free Alerts
          </Link>
          <p
            style={{
              fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
              fontSize: "13px",
              color: "#6B6560",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            Free forever. No spam.
          </p>
        </div>
      </div>

      {/* Spacer to prevent content hiding under fixed nav */}
      <div style={{ height: "72px" }} aria-hidden="true" />
    </>
  );
}
