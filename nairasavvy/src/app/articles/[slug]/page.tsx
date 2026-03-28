import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterCTA from "@/components/NewsletterCTA";
import { getAllArticles, getArticleBySlug, type Faq } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nairasavvy.ng";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
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

function preprocessContent(raw: string): string {
  const schemaIdx = raw.indexOf("[JSON-LD SCHEMA");
  const content = schemaIdx !== -1 ? raw.slice(0, schemaIdx).trimEnd() : raw;
  const lines = content.split("\n");
  const result: string[] = [];
  let i = 0;
  const SECTION_LABELS = ["HOOK", "PROBLEM", "NEED TO KNOW", "ACTION STEPS", "BOTTOM LINE", "FAQ"];
  while (i < lines.length) {
    const line = lines[i];
    const defMatch = line.match(/^\[DEFINITION BLOCK \u2014 term: "([^"]+)"\]$/);
    if (defMatch) {
      const term = defMatch[1];
      i++;
      while (i < lines.length && lines[i].trim() === "") i++;
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("[")) {
        paraLines.push(lines[i]);
        i++;
      }
      result.push("", `<DefinitionBlock term="${term}">`, "", paraLines.join("\n"), "", "</DefinitionBlock>", "");
      continue;
    }
    const sectionLabel = SECTION_LABELS.find((l) => line === `[${l}]`);
    if (sectionLabel) {
      result.push("", `<SectionLabel label="${sectionLabel}" />`, "");
      i++;
      continue;
    }
    if (line.trim() === "[NEWSLETTER CTA]") {
      result.push("", "<InlineNewsletterCTA />", "");
      i++;
      continue;
    }
    result.push(line);
    i++;
  }
  return result.join("\n");
}

function DefinitionBlock({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#E8F5EE", borderLeft: "4px solid #1B5E3B", padding: "24px", borderRadius: "4px", margin: "32px 0" }}>
      <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1B5E3B", margin: "0 0 12px" }}>Definition: {term}</p>
      <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "15px", lineHeight: "1.75", color: "#1A1A1A" }}>{children}</div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9CA3A0", borderBottom: "1px solid #D4CFC8", paddingBottom: "8px", marginTop: "48px", marginBottom: "24px" }}>{label}</div>
  );
}

function InlineNewsletterCTA() {
  return (
    <div style={{ backgroundColor: "#0F0F0D", borderRadius: "4px", padding: "40px", margin: "48px 0", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1B5E3B", marginBottom: "12px" }}>The Naira Shield</p>
      <h3 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "24px", color: "#FFFFFF", marginBottom: "12px", lineHeight: "1.3" }}>Get free weekly financial intelligence</h3>
      <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "15px", color: "#9CA3A0", marginBottom: "24px" }}>Best rates \u00b7 Bank alerts \u00b7 Consumer rights \u00b7 Smart moves</p>
      <Link href="/newsletter" className="btn-primary">Get Free Alerts \u2192</Link>
    </div>
  );
}

const mdxComponents: MDXComponents = {
  DefinitionBlock: DefinitionBlock as React.ComponentType<Record<string, unknown>>,
  SectionLabel: SectionLabel as React.ComponentType<Record<string, unknown>>,
  InlineNewsletterCTA: InlineNewsletterCTA as React.ComponentType<Record<string, unknown>>,
  h1: ({ children }) => <h1 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: "1.2", fontWeight: 700, color: "#1A1A1A", marginTop: "40px", marginBottom: "16px" }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "clamp(22px, 3vw, 28px)", lineHeight: "1.3", fontWeight: 700, color: "#1A1A1A", marginTop: "40px", marginBottom: "16px" }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "20px", lineHeight: "1.4", fontWeight: 700, color: "#1A1A1A", marginTop: "32px", marginBottom: "12px" }}>{children}</h3>,
  p: ({ children }) => <p style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "17px", lineHeight: "1.8", color: "#1A1A1A", marginBottom: "24px" }}>{children}</p>,
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1A1A1A" }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: "italic", color: "#6B6560" }}>{children}</em>,
  a: ({ href, children }) => <a href={href} style={{ color: "#1B5E3B", textDecoration: "underline", textUnderlineOffset: "3px" }}>{children}</a>,
  blockquote: ({ children }) => <blockquote style={{ borderLeft: "4px solid #D4CFC8", paddingLeft: "24px", marginLeft: 0, color: "#6B6560", fontStyle: "italic" }}>{children}</blockquote>,
};

const CATEGORY_LABELS: Record<string, string> = {
  news: "News", savings: "Savings", "fight-back": "Fight Back", grow: "Grow", "cut-costs": "Cut Costs",
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const processedContent = preprocessContent(article.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "NairaSavvy", url: siteUrl },
    description: article.excerpt,
    url: `${siteUrl}/articles/${article.slug}`,
  };

  const faqSchema = article.faqs && article.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq: Faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Nav />
      <main style={{ backgroundColor: "#F5F0E8" }}>
        <header id="hero-sentinel" style={{ backgroundColor: "#F5F0E8", padding: "80px 24px 48px", borderBottom: "1px solid #D4CFC8" }}>
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <Link href={`/${article.category}`} className="category-tag" style={{ textDecoration: "none" }}>
                {CATEGORY_LABELS[article.category] ?? article.category}
              </Link>
              <span className="type-small" style={{ color: "#6B6560" }}>{article.readTime} min read</span>
            </div>
            <h1 className="type-h1" style={{ color: "#1A1A1A", marginBottom: "24px" }}>{article.title}</h1>
            <p className="type-body" style={{ color: "#6B6560", fontSize: "18px", lineHeight: "1.6", marginBottom: "32px" }}>{article.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", paddingTop: "24px", borderTop: "1px solid #D4CFC8" }}>
              <span style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>{article.author}</span>
              <span style={{ color: "#D4CFC8" }}>\u00b7</span>
              <time dateTime={article.publishedAt} style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "14px", color: "#6B6560" }}>{formatDate(article.publishedAt)}</time>
              <span style={{ color: "#D4CFC8" }}>\u00b7</span>
              <span style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "14px", color: "#6B6560" }}>{article.readTime} min read</span>
            </div>
          </div>
        </header>
        <article style={{ padding: "56px 24px 80px" }}>
          <div className="container-content" style={{ maxWidth: "760px" }}>
            <MDXRemote source={processedContent} components={mdxComponents} />
            {article.sources && article.sources.length > 0 && (
              <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid #D4CFC8" }}>
                <p className="type-label" style={{ color: "#6B6560", marginBottom: "12px" }}>Sources</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {article.sources.map((source, i) => {
                    const parts = source.split(", ");
                    const url = parts[parts.length - 1];
                    const label = parts.slice(0, -1).join(", ");
                    const isUrl = url.startsWith("http");
                    return (
                      <li key={i} style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", fontSize: "13px", color: "#6B6560" }}>
                        {isUrl ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#1B5E3B", textDecoration: "underline" }}>{label || source}</a> : source}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </article>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
