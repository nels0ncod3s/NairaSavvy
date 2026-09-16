import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  ShieldCheck,
  MoveUpRight,
  Radio,
  Sparkles,
} from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import NewsletterCTA from "@/components/NewsletterCTA";
import ErosionCalculator from "@/components/tools/ErosionCalculator";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentInflationRate } from "@/lib/data/inflation";
export const dynamic = "force-dynamic";

const pathways = [
  {
    n: "01",
    name: "Protect it.",
    description:
      "Understand what inflation means for your savings. Compare the details that count.",
    href: "/savings",
    cta: "Compare savings",
    icon: ShieldCheck,
    style: "protect",
  },
  {
    n: "02",
    name: "Grow it.",
    description:
      "Make sense of money markets, treasury bills and the trade-offs behind the returns.",
    href: "/grow",
    cta: "Explore your options",
    icon: MoveUpRight,
    style: "grow",
  },
  {
    n: "03",
    name: "Stretch it.",
    description:
      "Spend less on the everyday. Find data plans that fit your budget and your life.",
    href: "/cut-costs/data-plans",
    cta: "Compare data plans",
    icon: Radio,
    style: "stretch",
  },
];

export default async function Home() {
  const inflation = await getCurrentInflationRate();
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1} className="studio-home">
        <section className="money-hero" id="hero-sentinel">
          <div className="container-content">
            <div className="hero-kicker">
              <span className="status-dot" /> YOUR MONEY. YOUR MOVE.
              <span className="hero-location">
                INDEPENDENT THINKING · NIGERIAN MONEY
              </span>
            </div>
            <div className="hero-composition">
              <div className="hero-copy">
                <h1 className="hero-animate-1">
                  More power
                  <br />
                  to your <em>naira.</em>
                  <span className="heading-dot">✳</span>
                </h1>
                <p className="hero-animate-2">
                  You work hard for your money.
                  <br />
                  Let’s make sure it works hard for you.
                </p>
                <div className="hero-actions hero-animate-3">
                  <Link className="btn-primary" href="#money-tool">
                    Meet your money <ArrowUpRight size={19} />
                  </Link>
                  <Link className="quiet-link" href="/articles">
                    Find your next read <ArrowUpRight size={17} />
                  </Link>
                </div>
                <div className="hero-footnote">
                  <ShieldCheck size={16} /> Free tools. Clear guides. No
                  financial jargon.
                </div>
              </div>
              <div className="naira-art" aria-hidden="true">
                <div className="art-grid" />
                <span className="art-coordinate">
                  NGN / A LITTLE MORE POSSIBILITY
                </span>
                <div className="coin-orbit orbit-one" />
                <div className="coin-orbit orbit-two" />
                <div className="naira-coin">
                  <span>₦</span>
                  <div className="coin-caption">KNOW MORE · KEEP MORE ·</div>
                </div>
                <div className="art-sticker">
                  <Sparkles size={19} />
                  <span>
                    A smarter
                    <br />
                    money mindset.
                  </span>
                </div>
                <div className="art-bottom">
                  <span>MADE FOR REAL LIFE IN NIGERIA</span>
                  <ArrowUpRight size={30} />
                </div>
              </div>
            </div>
            <div className="hero-bottom">
              <span>A little clarity goes a long way.</span>
              <a href="#start-here">
                SCROLL TO GET SAVVY <ArrowDown size={15} />
              </a>
            </div>
          </div>
        </section>
        <div className="principles-strip">
          <span>LESS GUESSWORK.</span>
          <span aria-hidden="true">✳</span>
          <span>BETTER MONEY MOVES.</span>
          <span aria-hidden="true">✳</span>
          <span>MORE YOU.</span>
          <span aria-hidden="true">✳</span>
        </div>
        <section id="start-here" className="studio-section container-content">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / START WHERE YOU ARE</p>
              <h2>
                Your money has potential.
                <br />
                <em>Give it a direction.</em>
              </h2>
            </div>
            <p>
              Saving for something big or making it to payday. There’s a smarter
              next step.
            </p>
          </div>
          <div className="pathway-grid">
            {pathways.map(
              ({ n, name, description, href, cta, icon: Icon, style }, i) => (
                <AnimateOnScroll key={n} delay={i * 90}>
                  <Link href={href} className={`pathway-card pathway-${style}`}>
                    <div className="pathway-top">
                      <span>{n} /</span>
                      <ArrowUpRight size={23} />
                    </div>
                    <div className="pathway-art" aria-hidden="true">
                      <Icon strokeWidth={1.1} />
                    </div>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <span className="pathway-cta">
                      {cta}
                      <ArrowUpRight size={18} />
                    </span>
                  </Link>
                </AnimateOnScroll>
              ),
            )}
          </div>
        </section>
        <section id="money-tool" className="money-lab">
          <div className="container-content">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / THE REALITY CHECK</p>
                <h2>
                  Same balance.
                  <br />
                  <em>Different buying power.</em>
                </h2>
              </div>
              <div>
                <p>
                  Your balance can stand still while prices move. Try the
                  calculator to see what that could mean for you.
                </p>
                <Link
                  className="quiet-link"
                  href="/tools/naira-erosion-calculator"
                >
                  Open full calculator <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <AnimateOnScroll variant="scale">
              <ErosionCalculator
                initialInflationRate={inflation?.rate_percent}
                inflationPeriod={inflation?.period}
                inflationSource={inflation?.source}
              />
            </AnimateOnScroll>
            <div className="lab-caption">
              <span>UNDERSTAND THE NUMBERS. OWN YOUR NEXT MOVE.</span>
              <Link href="/savings">
                Now compare savings options <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>
        <section className="studio-section container-content">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / THE SAVVY EDIT</p>
              <h2>
                Good reads.
                <br />
                <em>Better decisions.</em>
              </h2>
            </div>
            <Link className="quiet-link" href="/articles">
              Explore the journal <ArrowUpRight size={19} />
            </Link>
          </div>
          <ArticleGrid limit={3} excludeArchived />
        </section>
        <section className="rights-section container-content">
          <div className="rights-card">
            <div className="rights-symbol" aria-hidden="true">
              !
            </div>
            <div>
              <p className="eyebrow">04 / FIND YOUR VOICE</p>
              <h2>
                A failed transaction
                <br />
                shouldn’t be your loss.
              </h2>
              <p>
                Know what to document, where to complain, and how to put it in
                writing. Let’s take the first step.
              </p>
              <Link href="/tools/complaint-letter" className="btn-primary">
                Build your complaint letter <ArrowUpRight size={18} />
              </Link>
              <Link href="/fight-back" className="quiet-link">
                Know your rights <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NewsletterCTA />
      <Footer />
    </>
  );
}
