import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Guides, analysis, and how-tos to help you protect your money, fight back against banks, and grow what you have.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "All Articles | NairaSavvy",
    description:
      "Every guide, analysis, and how-to on NairaSavvy. Savings rates, consumer rights, naira moves, and more.",
    url: "/articles",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  news: "News",
  savings: "Savings",
  "fight-back": "Fight Back",
  grow: "Grow",
  "cut-costs": "Cut Costs",
};

const CATEGORIES = [
  "all",
  "news",
  "savings",
  "fight-back",
  "grow",
  "cut-costs",
];

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory =
    params.category && CATEGORIES.includes(params.category)
      ? params.category
      : "all";

  return (
    <>
      <Nav />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ backgroundColor: "#F5F0E8" }}
      >
        {/* Hero */}
        <section
          id="hero-sentinel"
          style={{
            backgroundColor: "#F5F0E8",
            padding: "100px 24px 60px",
          }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span
              className="category-tag"
              style={{ marginBottom: "20px", display: "inline-block" }}
            >
              Articles
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              Everything you need to know about your money.
            </h1>
            <p
              className="type-body"
              style={{
                color: "#6B6560",
                maxWidth: "600px",
                marginBottom: "0",
                fontSize: "18px",
                lineHeight: "1.7",
              }}
            >
              Plain-English guides, breaking-down CBN policy, savings rate
              comparisons, and step-by-step how-tos for every Nigerian who wants
              to stop losing and start winning with their money.
            </p>
          </div>
        </section>

        {/* Category filter tabs */}
        <section style={{ padding: "0 24px 40px" }}>
          <div className="container-content">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                borderBottom: "1px solid #D4CFC8",
                paddingBottom: "0",
              }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                const label =
                  cat === "all" ? "All" : (CATEGORY_LABELS[cat] ?? cat);
                const href =
                  cat === "all" ? "/articles" : `/articles?category=${cat}`;
                return (
                  <a
                    key={cat}
                    href={href}
                    style={{
                      fontFamily: "var(--font-sans, system-ui, sans-serif)",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: "10px 16px",
                      color: isActive ? "#1B5E3B" : "#6B6560",
                      borderBottom: isActive
                        ? "2px solid #1B5E3B"
                        : "2px solid transparent",
                      transition: "color 0.2s, border-color 0.2s",
                      marginBottom: "-1px",
                    }}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Articles grid */}
        <section className="ns-section">
          <div className="container-content">
            <ArticleGrid
              category={activeCategory === "all" ? undefined : activeCategory}
            />
          </div>
        </section>
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  );
}
