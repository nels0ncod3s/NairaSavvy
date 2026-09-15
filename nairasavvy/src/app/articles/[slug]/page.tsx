import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import { getAllArticles, getArticleBySlug, type Faq } from "@/lib/articles";
import { SourcesBlock } from "@/components/article/SourcesBlock";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nairasavvy.ng";

/* ─── Static params ─────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

/* ─── Metadata ──────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    robots: article.reviewRequired ? { index: false, follow: true } : undefined,
    title: article.seoTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    keywords: article.keywords,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt,
      url: `/articles/${slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

/* ─── Content pre-processing ────────────────────────────────────────── */

function preprocessContent(raw: string): string {
  // Strip [JSON-LD SCHEMA...], [SCHEMA], or bare ```json schema blocks — everything from there to end
  let content = raw;
  for (const marker of ["[JSON-LD SCHEMA", "[SCHEMA]", "[SCHEMA"]) {
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      content = content.slice(0, idx).trimEnd();
      break;
    }
  }

  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;

  const SECTION_LABELS = [
    "HOOK",
    "PROBLEM",
    "NEED TO KNOW",
    "ACTION STEPS",
    "BOTTOM LINE",
    "FAQ",
  ];

  while (i < lines.length) {
    const line = lines[i];

    // Definition block marker
    const defMatch = line.match(/^\[DEFINITION BLOCK term: "([^"]+)"\]$/);
    if (defMatch) {
      const term = defMatch[1];
      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].startsWith("[")
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      result.push("");
      result.push(`<DefinitionBlock term="${term}">`);
      result.push("");
      result.push(paraLines.join("\n"));
      result.push("");
      result.push("</DefinitionBlock>");
      result.push("");
      continue;
    }

    // FAQ Q&A: **Q: question text** followed by A: answer text
    const faqQMatch = line.match(/^\*\*Q:\s*(.+?)\*\*$/);
    if (faqQMatch) {
      const question = faqQMatch[1].trim();
      i++;
      // skip blank lines
      while (i < lines.length && lines[i].trim() === "") i++;
      // collect answer lines (starts with "A: " or is continuation)
      const answerLines: string[] = [];
      if (i < lines.length && lines[i].startsWith("A:")) {
        answerLines.push(lines[i].replace(/^A:\s*/, "").trim());
        i++;
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          !lines[i].startsWith("**Q:")
        ) {
          answerLines.push(lines[i]);
          i++;
        }
      }
      const answer = answerLines.join(" ").trim();
      result.push("");
      result.push(`<FAQItem question="${question.replace(/"/g, "&quot;")}">`);
      result.push(answer);
      result.push("</FAQItem>");
      result.push("");
      continue;
    }

    // Section label markers
    const sectionLabel = SECTION_LABELS.find((l) => line === `[${l}]`);
    if (sectionLabel) {
      result.push("");
      result.push(`<SectionLabel label="${sectionLabel}" />`);
      result.push("");
      i++;
      continue;
    }

    // Newsletter CTA placeholder
    if (line.trim() === "[NEWSLETTER CTA]") {
      result.push("");
      result.push("<InlineNewsletterCTA />");
      result.push("");
      i++;
      continue;
    }

    result.push(line);
    i++;
  }

  return result.join("\n");
}

/* ─── Custom MDX components ─────────────────────────────────────────── */

function DefinitionBlock({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#E8F5EE",
        borderLeft: "4px solid #1B5E3B",
        padding: "24px",
        borderRadius: "4px",
        margin: "32px 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#1B5E3B",
          margin: "0 0 12px",
        }}
      >
        Definition: {term}
      </p>
      <div
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "15px",
          lineHeight: "1.75",
          color: "#1A1A1A",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  const isFaq = label === "FAQ";
  return (
    <div
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#9CA3A0",
        borderBottom: isFaq ? "none" : "1px solid #D4CFC8",
        borderTop: isFaq ? "1px solid #D4CFC8" : "none",
        paddingBottom: "8px",
        paddingTop: isFaq ? "48px" : "0",
        marginTop: isFaq ? "0" : "48px",
        marginBottom: "16px",
      }}
    >
      {isFaq
        ? "Frequently Asked Questions"
        : ({
            HOOK: "The situation",
            PROBLEM: "What happened",
            "NEED TO KNOW": "What to know",
            "ACTION STEPS": "Your next steps",
            "BOTTOM LINE": "What this means",
          }[label] ?? label)}
    </div>
  );
}

function FAQItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid #D4CFC8",
        padding: "20px 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1A1A1A",
          margin: "0 0 10px",
          lineHeight: "1.5",
        }}
      >
        {question}
      </p>
      <div
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "16px",
          lineHeight: "1.75",
          color: "#6B6560",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function InlineNewsletterCTA() {
  return (
    <div
      className="inline-cta-box"
      style={{
        backgroundColor: "#0F0F0D",
        borderRadius: "4px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#1B5E3B",
          marginBottom: "12px",
        }}
      >
        The Naira Shield
      </p>
      <h3
        style={{
          fontFamily: "var(--font-serif, Georgia, serif)",
          fontSize: "24px",
          color: "#FFFFFF",
          marginBottom: "12px",
          lineHeight: "1.3",
        }}
      >
        Get free weekly financial intelligence
      </h3>
      <p
        style={{
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          fontSize: "15px",
          color: "#9CA3A0",
          marginBottom: "24px",
        }}
      >
        Best rates · Bank alerts · Consumer rights · Smart moves
      </p>
      <Link href="/newsletter" className="btn-primary">
        Get Free Alerts →
      </Link>
    </div>
  );
}

const mdxComponents: MDXComponents = {
  DefinitionBlock: DefinitionBlock as React.ComponentType<
    Record<string, unknown>
  >,
  SectionLabel: SectionLabel as React.ComponentType<Record<string, unknown>>,
  InlineNewsletterCTA: InlineNewsletterCTA as React.ComponentType<
    Record<string, unknown>
  >,
  FAQItem: FAQItem as React.ComponentType<Record<string, unknown>>,
  // Prose overrides
  h1: ({ children }) => (
    <h1
      style={{
        fontFamily: "var(--font-serif, Georgia, serif)",
        fontSize: "clamp(32px, 4vw, 44px)",
        lineHeight: "1.15",
        fontWeight: 700,
        color: "#1A1A1A",
        marginTop: "48px",
        marginBottom: "20px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontFamily: "var(--font-serif, Georgia, serif)",
        fontSize: "clamp(26px, 3vw, 34px)",
        lineHeight: "1.25",
        fontWeight: 700,
        color: "#1A1A1A",
        marginTop: "56px",
        marginBottom: "16px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontFamily: "var(--font-serif, Georgia, serif)",
        fontSize: "22px",
        lineHeight: "1.35",
        fontWeight: 700,
        color: "#1A1A1A",
        marginTop: "40px",
        marginBottom: "12px",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "16px",
        lineHeight: "1.5",
        fontWeight: 700,
        color: "#1A1A1A",
        marginTop: "28px",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "17px",
        lineHeight: "1.85",
        color: "#1A1A1A",
        marginBottom: "24px",
      }}
    >
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "17px",
        lineHeight: "1.85",
        color: "#1A1A1A",
        marginBottom: "24px",
        paddingLeft: "24px",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "17px",
        lineHeight: "1.85",
        color: "#1A1A1A",
        marginBottom: "24px",
        paddingLeft: "24px",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: "8px" }}>{children}</li>,
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700, color: "#1A1A1A" }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: "italic", color: "#6B6560" }}>{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      style={{
        color: "#1B5E3B",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "4px solid #1B5E3B",
        paddingLeft: "24px",
        marginLeft: 0,
        marginRight: 0,
        marginTop: "32px",
        marginBottom: "32px",
        color: "#6B6560",
        fontStyle: "italic",
        fontSize: "18px",
        lineHeight: "1.7",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #D4CFC8",
        margin: "48px 0",
      }}
    />
  ),
};

/* ─── Category label map ─────────────────────────────────────────────── */

const CATEGORY_LABELS: Record<string, string> = {
  news: "News",
  savings: "Savings",
  "fight-back": "Fight Back",
  grow: "Grow",
  "cut-costs": "Cut Costs",
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const processedContent = preprocessContent(article.content);

  // Build JSON-LD schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "NairaSavvy",
      url: siteUrl,
    },
    description: article.excerpt,
    url: `${siteUrl}/articles/${article.slug}`,
  };

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq: Faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD schemas in head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <Nav />

      <main
        id="main-content"
        tabIndex={-1}
        style={{ backgroundColor: "#F5F0E8" }}
      >
        {/* Article header */}
        <header
          id="hero-sentinel"
          className="article-header"
          style={{
            backgroundColor: "#F5F0E8",
            borderBottom: "1px solid #D4CFC8",
          }}
        >
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href={`/${article.category}`}
                className="category-tag"
                style={{ textDecoration: "none" }}
              >
                {CATEGORY_LABELS[article.category] ?? article.category}
              </Link>
              <span className="type-small" style={{ color: "#6B6560" }}>
                {article.readTime} min read
              </span>
            </div>

            <h1
              className="type-h1"
              style={{ color: "#1A1A1A", marginBottom: "24px" }}
            >
              {article.title}
            </h1>

            <p
              className="type-body"
              style={{
                color: "#6B6560",
                fontSize: "18px",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              {article.excerpt}
            </p>

            {article.reviewRequired && (
              <aside className="review-note">
                Archived story: time-sensitive claims and quoted rates need a
                fresh source review. Do not use this article as current
                financial or regulatory guidance.{" "}
                <Link href="/editorial-policy">How we review content</Link>.
              </aside>
            )}
            {article.updatedAt && (
              <p>Updated: {formatDate(article.updatedAt)}</p>
            )}
            {/* Meta line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                paddingTop: "24px",
                borderTop: "1px solid #D4CFC8",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                }}
              >
                {article.author}
              </span>
              <span style={{ color: "#D4CFC8" }}>·</span>
              <time
                dateTime={article.publishedAt}
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  color: "#6B6560",
                }}
              >
                {formatDate(article.publishedAt)}
              </time>
              <span style={{ color: "#D4CFC8" }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-sans, system-ui, sans-serif)",
                  fontSize: "14px",
                  color: "#6B6560",
                }}
              >
                {article.readTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="article-body">
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <MDXRemote source={processedContent} components={mdxComponents} />
          </div>
        </article>
      </main>

      <NewsletterCTA />

      {/* Sources: always last, inside reading column */}
      {article.articleSources && article.articleSources.length > 0 && (
        <section
          className="ns-section"
          style={{ backgroundColor: "#F5F0E8", paddingTop: "0" }}
        >
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <SourcesBlock sources={article.articleSources} />
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
