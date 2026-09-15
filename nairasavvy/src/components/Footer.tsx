import Link from "next/link";

const pillars = [
  {
    label: "Protect",
    links: [
      { label: "Savings & Yields", href: "/savings" },
      { label: "NairaGuard Dashboard", href: "/savings" },
      {
        label: "Naira Erosion Calculator",
        href: "/tools/naira-erosion-calculator",
      },
    ],
  },
  {
    label: "Fight Back",
    links: [
      { label: "Consumer Rights", href: "/fight-back" },
      {
        label: "Bank App Down? What To Do",
        href: "/articles/bank-app-down-what-to-do-polaris-vulte",
      },
      { label: "Complaint Letter Generator", href: "/tools/complaint-letter" },
    ],
  },
  {
    label: "Grow",
    links: [
      { label: "Investment Options", href: "/grow" },
      { label: "T-Bills & Money Markets", href: "/grow" },
      { label: "Dollar Accounts", href: "/grow" },
    ],
  },
  {
    label: "Guides",
    links: [
      { label: "All Articles", href: "/articles" },
      { label: "Compare Savings Products", href: "/savings" },
      { label: "Data Plan Deals", href: "/cut-costs/data-plans" },
    ],
  },
];

const legalLinks = [
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "About", href: "/about" },
  { label: "Newsletter", href: "/newsletter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#0F0F0D",
        color: "#FFFFFF",
      }}
    >
      {/* Main footer content */}
      <div
        className="container-content"
        style={{ paddingTop: "80px", paddingBottom: "64px" }}
      >
        {/* Top: wordmark + tagline */}
        <div
          className="footer-main-grid md:grid-cols-5"
          style={{
            display: "grid",

            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div className="footer-brand">
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-playfair, Georgia, serif)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#FFFFFF",
                textDecoration: "none",
                display: "block",
                marginBottom: "16px",
              }}
            >
              NairaSavvy
            </Link>
            <p
              style={{
                fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                fontSize: "15px",
                lineHeight: "24px",
                color: "#9CA3A0",
                marginBottom: "32px",
                maxWidth: "300px",
              }}
            >
              Your money. Protected. Grown. Defended.
            </p>
            <Link
              href="/newsletter"
              className="btn-primary"
              style={{ fontSize: "14px", padding: "11px 20px" }}
            >
              Get Free Alerts
            </Link>
          </div>

          {/* Nav columns */}
          {pillars.map((pillar) => (
            <div key={pillar.label}>
              <p
                className="type-label"
                style={{
                  color: "#B4B1AA",
                  marginBottom: "20px",
                }}
              >
                {pillar.label}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {pillar.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily:
                          "var(--font-dm-sans, system-ui, sans-serif)",
                        fontSize: "14px",
                        color: "#C4BFB8",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      className="hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#1C1C1A",
            marginBottom: "40px",
          }}
        />

        {/* Legal disclaimer */}
        <div
          style={{
            backgroundColor: "#1C1C1A",
            borderRadius: "4px",
            padding: "24px",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
              fontSize: "13px",
              lineHeight: "22px",
              color: "#B4B1AA",
              margin: 0,
            }}
          >
            <strong style={{ color: "#9CA3A0", fontWeight: 600 }}>
              Disclaimer:{" "}
            </strong>
            NairaSavvy is a financial education and information platform.
            Nothing on this site constitutes financial advice. Always verify
            current rates and consult a qualified financial advisor before
            making investment decisions. We may earn affiliate commissions from
            some links. These are always clearly labelled. APY rates shown are
            for informational purposes only and may have changed since last
            verified. Past performance does not guarantee future returns.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start",
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
              fontSize: "13px",
              color: "#B4B1AA",
              margin: 0,
            }}
          >
            © {currentYear} NairaSavvy · Built by{" "}
            <span style={{ color: "#B4B1AA" }}>KwenuAI</span>
          </p>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-dm-sans, system-ui, sans-serif)",
                  fontSize: "13px",
                  color: "#B4B1AA",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                className="hover:text-gray-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
