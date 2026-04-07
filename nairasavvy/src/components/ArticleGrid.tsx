import Link from "next/link";
import { getArticlesByCategory, type ArticleMeta } from "@/lib/articles";
import AnimateOnScroll from "@/components/AnimateOnScroll";

interface ArticleGridProps {
  category?: string;
}

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

function CategoryLabel({ category }: { category: string }) {
  const labels: Record<string, string> = {
    news: "News",
    savings: "Savings",
    "fight-back": "Fight Back",
    grow: "Grow",
    "cut-costs": "Cut Costs",
  };
  return (
    <span className="category-tag">{labels[category] ?? category}</span>
  );
}

function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        className="card"
        style={{
          borderRadius: "4px",
          padding: "32px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <CategoryLabel category={article.category} />
          <span
            className="type-small"
            style={{ color: "#6B6560", whiteSpace: "nowrap" }}
          >
            {article.readTime} min read
          </span>
        </div>

        <h3
          className="type-h3"
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "22px",
            lineHeight: "1.3",
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          {article.title}
        </h3>

        <p
          className="type-body"
          style={{
            color: "#6B6560",
            margin: 0,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.excerpt}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid #D4CFC8",
          }}
        >
          <span className="type-small" style={{ color: "#6B6560" }}>
            {formatDate(article.publishedAt)}
          </span>
          <span
            style={{
              color: "#1B5E3B",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Read →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function ArticleGrid({ category }: ArticleGridProps) {
  const articles = getArticlesByCategory(category);

  if (articles.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#0F0F0D",
          borderRadius: "4px",
          padding: "56px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: "#1B5E3B",
            marginBottom: "16px",
          }}
        >
          The Naira Shield
        </p>
        <h3
          style={{
            fontFamily: "var(--font-serif, Georgia, serif)",
            fontSize: "24px",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: "12px",
            lineHeight: "1.3",
          }}
        >
          Guides for this section are on their way.
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontSize: "16px",
            color: "#888884",
            maxWidth: "400px",
            margin: "0 auto 28px",
            lineHeight: "1.6",
          }}
        >
          Subscribe to the Naira Shield and we&apos;ll notify you the moment
          new guides are published.
        </p>
        <Link href="/newsletter" className="btn-primary">
          Get Notified Free &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
        gap: "24px",
      }}
    >
      {articles.map((article, i) => (
        <AnimateOnScroll key={article.slug} delay={i * 100} variant="fadeUp">
          <ArticleCard article={article} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}
