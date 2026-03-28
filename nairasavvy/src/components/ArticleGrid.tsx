import Link from "next/link";
import { getArticlesByCategory, type ArticleMeta } from "@/lib/articles";

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
          textAlign: "center",
          padding: "64px 24px",
          border: "1px dashed #D4CFC8",
          borderRadius: "4px",
        }}
      >
        <p
          className="type-h3"
          style={{ color: "#6B6560", marginBottom: "8px" }}
        >
          No articles yet. Check back soon.
        </p>
        <p className="type-body" style={{ color: "#9CA3A0" }}>
          We&apos;re working on guides for this section.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
