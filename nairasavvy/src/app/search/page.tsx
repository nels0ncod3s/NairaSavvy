import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import { getAllArticles } from "@/lib/articles";
export const metadata: Metadata = {
  title: "Search guides and tools",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};
const tools = [
  {
    title: "Inflation erosion calculator",
    href: "/tools/naira-erosion-calculator",
    text: "Savings purchasing power inflation",
  },
  {
    title: "Complaint letter generator",
    href: "/tools/complaint-letter",
    text: "Bank failed transfer refund dispute rights",
  },
  {
    title: "Data plan comparison",
    href: "/cut-costs/data-plans",
    text: "MTN Airtel Glo mobile data budget",
  },
];
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 150) : "";
  const items = [
    ...tools,
    ...getAllArticles().map((a) => ({
      title: a.title,
      href: `/articles/${a.slug}`,
      text: `${a.excerpt} ${a.category}`,
    })),
  ].filter(
    (a) =>
      query &&
      `${a.title} ${a.text}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero search-page">
          <div className="container-content">
            <p className="eyebrow">A LITTLE DIRECTION</p>
            <h1 className="type-h1">
              What’s on your
              <br />
              <em>money mind?</em>
            </h1>
            <form action="/search" role="search" className="search-form">
              <label htmlFor="search">Search NairaSavvy</label>
              <div className="newsletter-fields">
                <input
                  id="search"
                  name="q"
                  defaultValue={query}
                  maxLength={150}
                  className="input"
                  placeholder="Try savings, bank or data"
                />
                <button className="btn-primary">
                  <SearchIcon size={17} aria-hidden="true" /> Search
                </button>
              </div>
            </form>
            <p>
              {query
                ? `${items.length} results for “${query}”`
                : "Enter a topic to start searching."}
            </p>
            {!query && (
              <div className="search-topics">
                <span>Good places to start</span>
                {["savings", "bank", "data", "inflation"].map((topic) => (
                  <Link key={topic} href={`/search?q=${topic}`}>
                    {topic} ↗
                  </Link>
                ))}
              </div>
            )}
            {query && items.length === 0 && (
              <div className="tool-panel">
                <h2 className="type-h3">Let’s try a different angle.</h2>
                <p>
                  No matching guides yet. Try a shorter term such as “bank”,
                  “data” or “savings”.
                </p>
                <Link className="quiet-link" href="/articles">
                  Browse all guides <ArrowUpRight size={17} />
                </Link>
              </div>
            )}
            <div className="search-results">
              {items.map((item) => (
                <article key={item.href}>
                  <h2 className="type-h3">
                    <Link href={item.href}>
                      {item.title}
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </Link>
                  </h2>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
