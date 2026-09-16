import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import PageHero from "@/components/PageHero";
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
      <main id="main-content" tabIndex={-1}>
        <PageHero
          eyebrow="The Savvy Edit"
          title="A good read."
          accent="A smarter next move."
          description="Practical guides for the decisions that come with earning, spending, saving and growing your money."
        />
        <section className="container-content category-body">
          <nav
            className="category-filters"
            aria-label="Filter articles by category"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === "all" ? "/articles" : `/articles?category=${cat}`}
                aria-current={cat === activeCategory ? "page" : undefined}
              >
                {cat === "all" ? "All stories" : CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </nav>
          <ArticleGrid
            category={activeCategory === "all" ? undefined : activeCategory}
          />
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
