import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { briefings } from "@/lib/agents/bayo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Money briefings",
  description: "Source-linked financial briefings, reviewed by NairaSavvy.",
  alternates: { canonical: "/briefings" },
};
export default async function Page() {
  const { items, unavailable } = await briefings();
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="ns-hero">
          <div className="container-content">
            <span className="category-tag">The briefing room</span>
            <h1 className="type-h1">
              Know what moves
              <br />
              your money.
            </h1>
            <p className="type-body">
              Financial updates with the source in sight. Collected by Scout,
              prepared by Bayo, reviewed before publication.
            </p>
            <Link href="/newsletter" className="btn-primary">
              Get the Naira Shield
            </Link>
          </div>
        </section>
        <section className="container-content" style={{ paddingBottom: 80 }}>
          {!items.length ? (
            <p role="status">
              {unavailable
                ? "Briefings are temporarily unavailable. Please try again later."
                : "Our first reviewed briefings are on their way. Explore our guides while we prepare them."}{" "}
              <Link href="/articles">Read the journal →</Link>
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,300px),1fr))",
                gap: 24,
              }}
            >
              {items.map((row) => (
                <article
                  key={row.id}
                  style={{
                    border: "1px solid #d6d9ce",
                    borderRadius: 16,
                    padding: 28,
                    overflowWrap: "anywhere",
                  }}
                >
                  <span className="category-tag">{row.content.category}</span>
                  <h2 className="type-h3" style={{ margin: "20px 0" }}>
                    <Link href={`/briefings/${row.id}`}>
                      {row.content.title}
                    </Link>
                  </h2>
                  <p>{row.content.paragraphs[0]}</p>
                  <p className="type-small">Source: {row.content.source}</p>
                  <time dateTime={row.published_at}>
                    {new Date(row.published_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
