import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import ArticleGrid from "@/components/ArticleGrid"
import NewsletterCTA from "@/components/NewsletterCTA"
import { getConsumerCirculars } from "@/lib/data/cbn-circulars"

export const metadata: Metadata = {
  title: "What's Happening With Your Money",
  description:
    "CBN circulars, fintech updates, and banking news translated into plain English for everyday Nigerians.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "What's Happening With Your Money | NairaSavvy",
    description:
      "CBN circulars. Fintech updates. Translated into plain English.",
    url: "/news",
  },
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default async function NewsPage() {
  const circulars = await getConsumerCirculars()

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        {/* Hero */}
        <section
          id="hero-sentinel"
          style={{
            backgroundColor: "#F5F0E8",
            padding: "100px 24px 80px",
          }}
        >
          <div className="container-content" style={{ maxWidth: "800px" }}>
            <span
              className="category-tag"
              style={{ marginBottom: "20px", display: "inline-block" }}
            >
              News
            </span>
            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              CBN circulars. Fintech updates. Translated into plain English.
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
              Every CBN directive, fintech policy change, and banking update
              that affects your money, explained without the regulatory
              jargon. We tell you what it means and what to do.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section style={{ padding: "0 24px 100px" }}>
          <div className="container-content">
            <h2
              className="type-h2"
              style={{ color: "#1A1A1A", marginBottom: "40px" }}
            >
              Latest
            </h2>
            <ArticleGrid category="news" />
          </div>
        </section>

        {/* Policy Watch - CBN Circulars */}
        {circulars.length > 0 && (
          <section
            style={{
              padding: "0 24px 100px",
              backgroundColor: "#0F0F0D",
            }}
          >
            <div className="container-content">
              <h2
                className="type-h2"
                style={{ color: "#FFFFFF", marginBottom: "8px" }}
              >
                Policy Watch
              </h2>
              <p
                className="type-body"
                style={{ color: "#888884", marginBottom: "32px" }}
              >
                Recent CBN circulars that affect your money.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "16px",
                }}
              >
                {circulars.map((circular) => (
                  <a
                    key={circular.id}
                    href={circular.source_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#1C1C1A",
                        border: "1px solid #333331",
                        borderRadius: "4px",
                        padding: "24px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        transition: "transform 0.2s ease, border-color 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        {circular.category && (
                          <span
                            style={{
                              fontFamily:
                                "var(--font-sans, system-ui, sans-serif)",
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color: "#1B5E3B",
                              backgroundColor: "#E8F5EE",
                              padding: "3px 8px",
                              borderRadius: "2px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {circular.category}
                          </span>
                        )}
                        <span
                          className="type-small"
                          style={{
                            color: "#888884",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(circular.date_issued)}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          margin: "0",
                          lineHeight: "1.3",
                        }}
                      >
                        {circular.title}
                      </h3>

                      {circular.summary && (
                        <p
                          className="type-body"
                          style={{
                            color: "#888884",
                            margin: 0,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {circular.summary}
                        </p>
                      )}

                      <span
                        style={{
                          color: "#1B5E3B",
                          fontSize: "14px",
                          fontWeight: 600,
                          fontFamily: "var(--font-sans, system-ui, sans-serif)",
                        }}
                      >
                        Read full circular &rarr;
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <NewsletterCTA />
      <Footer />
    </>
  )
}
