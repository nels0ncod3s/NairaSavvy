import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function PageHero({
  eyebrow,
  title,
  accent,
  description,
  symbol = "✳",
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  symbol?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container-content">
        <div className="page-breadcrumb">
          <Link href="/">NairaSavvy</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <div className="page-hero-grid">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>
              {title}
              <br />
              <em>{accent}</em>
            </h1>
            <p className="page-hero-description">{description}</p>
          </div>
          <div className="page-hero-seal" aria-hidden="true">
            <span>{symbol}</span>
            <ArrowUpRight size={26} />
          </div>
        </div>
      </div>
    </section>
  );
}
