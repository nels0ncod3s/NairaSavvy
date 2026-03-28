import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  author: string;
  keywords: string[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface ArticleSource {
  name: string;
  year: string | number;
  url: string;
  description?: string;
}

export interface ArticleFull extends ArticleMeta {
  content: string;
  seoTitle?: string;
  metaDescription?: string;
  sources?: string[];
  articleSources?: ArticleSource[];
  faqs?: Faq[];
}

function parseArticleMeta(slug: string, data: Record<string, unknown>): ArticleMeta {
  return {
    slug,
    title: (data.title as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    category: (data.category as string) ?? "",
    publishedAt: (data.publishedAt as string) ?? "",
    readTime: (data.readTime as number) ?? 5,
    featured: (data.featured as boolean) ?? false,
    author: (data.author as string) ?? "NairaSavvy Editorial Team",
    keywords: (data.keywords as string[]) ?? [],
  };
}

export function getAllArticles(): ArticleMeta[] {
  try {
    if (!fs.existsSync(ARTICLES_DIR)) return [];
    const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
    return files
      .map((f) => {
        const slug = f.replace(".mdx", "");
        const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
        const { data } = matter(raw);
        return parseArticleMeta(slug, data);
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  } catch {
    return [];
  }
}

export function getArticlesByCategory(category?: string): ArticleMeta[] {
  const all = getAllArticles();
  if (!category) return all;
  return all.filter((a) => a.category === category);
}

export function getArticleBySlug(slug: string): ArticleFull | null {
  try {
    const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      ...parseArticleMeta(slug, data),
      content,
      seoTitle: data.seoTitle as string | undefined,
      metaDescription: data.metaDescription as string | undefined,
      sources: (data.sources as string[]) ?? [],
      articleSources: (data.articleSources as ArticleSource[]) ?? [],
      faqs: (data.faqs as Faq[]) ?? [],
    };
  } catch {
    return null;
  }
}
