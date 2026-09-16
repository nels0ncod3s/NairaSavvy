import Link from "next/link";
import { getArticlesByCategory, type ArticleMeta } from "@/lib/articles";
import AnimateOnScroll from "@/components/AnimateOnScroll";

interface ArticleGridProps {
  category?: string;
  limit?: number;
  excludeArchived?: boolean;
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
  return <span className="category-tag">{labels[category] ?? category}</span>;
}

function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link href={`/articles/${article.slug}`} className="journal-card">
      <article>
        <div
          className={`journal-art journal-${article.category}`}
          aria-hidden="true"
        >
          <span className="journal-art-label">THE SAVVY EDIT</span>
          <span className="journal-glyph">
            {article.category === "savings"
              ? "₦"
              : article.category === "grow"
                ? "↗"
                : article.category === "cut-costs"
                  ? "✳"
                  : "!"}
          </span>
          <span className="journal-art-corner">↗</span>
        </div>
        <div className="journal-meta">
          <CategoryLabel category={article.category} />
          <span>{article.readTime} min read</span>
        </div>
        {article.reviewRequired && (
          <p className="archive-label">Archived · source review needed</p>
        )}
        <h3>{article.title}</h3>
        <p className="journal-excerpt">{article.excerpt}</p>
        <div className="journal-bottom">
          <span>{formatDate(article.publishedAt)}</span>
          <span>Read story ↗</span>
        </div>
      </article>
    </Link>
  );
}

export default function ArticleGrid({
  category,
  limit,
  excludeArchived = false,
}: ArticleGridProps) {
  const articles = getArticlesByCategory(category)
    .filter((article) => !excludeArchived || !article.reviewRequired)
    .slice(0, limit);

  if (articles.length === 0) {
    return (
      <div className="editorial-empty">
        <span aria-hidden="true">✳</span>
        <div>
          <p className="eyebrow">MORE GOOD READS ON THE WAY</p>
          <h3>This chapter is still being written.</h3>
          <p>Explore the other guides while we work on this section.</p>
          <Link className="btn-primary" href="/articles">
            Explore all guides ↗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-grid">
      {articles.map((article, i) => (
        <AnimateOnScroll key={article.slug} delay={i * 100} variant="fadeUp">
          <ArticleCard article={article} />
        </AnimateOnScroll>
      ))}
    </div>
  );
}
