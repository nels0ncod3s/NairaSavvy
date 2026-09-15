import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
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
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content">
            <h1 className="type-h1">Find a guide or tool</h1>
            <form action="/search">
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
                <button className="btn-primary">Search</button>
              </div>
            </form>
            <p>
              {query
                ? `${items.length} results for “${query}”`
                : "Enter a topic to start searching."}
            </p>
            <div className="plan-grid">
              {items.map((item) => (
                <article className="card" key={item.href}>
                  <h2 className="type-h3">
                    <Link href={item.href}>{item.title}</Link>
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
