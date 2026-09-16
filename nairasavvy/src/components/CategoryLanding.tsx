import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Footer from "./Footer";
import PageHero from "./PageHero";
import ArticleGrid from "./ArticleGrid";
import NewsletterCTA from "./NewsletterCTA";
export default function CategoryLanding({
  category,
  label,
  title,
  accent,
  description,
  symbol,
  steps,
  tool,
}: {
  category: string;
  label: string;
  title: string;
  accent: string;
  description: string;
  symbol: string;
  steps: { title: string; text: string }[];
  tool: { title: string; text: string; href: string; cta: string };
}) {
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <PageHero
          eyebrow={label}
          title={title}
          accent={accent}
          description={description}
          symbol={symbol}
        />
        <section className="container-content category-body">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE CLARITY TO START</p>
              <h2>Start with the essentials.</h2>
            </div>
          </div>
          <div className="essentials-grid">
            {steps.map((step, i) => (
              <div key={step.title}>
                <span className="eyebrow">0{i + 1} /</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <Link className="featured-tool" href={tool.href}>
            <div>
              <p className="eyebrow">YOUR NEXT MOVE / FREE TOOL</p>
              <h2>{tool.title}</h2>
              <p>{tool.text}</p>
              <span>
                {tool.cta} <ArrowUpRight size={18} />
              </span>
            </div>
            <ArrowUpRight className="featured-tool-arrow" aria-hidden="true" />
          </Link>
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP EXPLORING</p>
              <h2>The {label.toLowerCase()} edit.</h2>
            </div>
            <Link className="quiet-link" href="/articles">
              All guides <ArrowUpRight size={17} />
            </Link>
          </div>
          <ArticleGrid category={category} />
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
