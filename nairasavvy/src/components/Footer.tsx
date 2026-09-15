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
  return (
    <footer className="studio-footer">
      <div className="container-content">
        <div className="footer-top">
          <p>
            Financial clarity.
            <br />A little more freedom.
          </p>
          <Link href="#main-content" className="back-to-start">
            BACK TO THE TOP ↑
          </Link>
        </div>
        <div className="footer-main-grid">
          <div className="footer-brand">
            <Link href="/" className="wordmark">
              <span className="brand-mark" aria-hidden="true">
                ₦
              </span>
              NairaSavvy.
            </Link>
            <p>
              For the money you earn.
              <br />
              And the life you’re building.
            </p>
            <span className="footer-origin">BUILT WITH PURPOSE IN NIGERIA</span>
          </div>
          {pillars.map((pillar) => (
            <div key={pillar.label}>
              <h3 className="eyebrow">{pillar.label}</h3>
              <ul>
                {pillar.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-disclaimer">
          NairaSavvy provides financial education, not personalised financial
          advice. Verify current rates and product terms before making
          decisions. Investments carry risk. Affiliate links, where used, are
          labelled.
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NairaSavvy · Built by KwenuAI</p>
          <div>
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-big-word" aria-hidden="true">
          Stay savvy<span>✳</span>
        </div>
      </div>
    </footer>
  );
}
