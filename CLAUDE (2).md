# NairaSavvy — Claude Code Project Bible

## What We Are Building
NairaSavvy is Nigeria's premier consumer financial intelligence platform.
Tagline: "Nigeria's financial system wasn't built for you. NairaSavvy was."
Mission: Help Nigerian middle and working class protect their money, fight
back against institutional failures, and find every legal financial edge
available to them.

Reference site for structure inspiration: moneysavingexpert.com
Reference site for design inspiration: paperclip.ing

---

## Tech Stack (DO NOT DEVIATE)

- Framework: Next.js 14 with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS with custom design tokens
- Database: Supabase (PostgreSQL)
- Content: MDX files for articles (stored in /content/articles/)
- Deployment: Vercel
- Email: Resend API for newsletter signups
- Analytics: Vercel Analytics (privacy-first)
- Fonts: Google Fonts — Playfair Display (headings) + DM Sans (body)

---

## Design System — FOLLOW EXACTLY

### Color Palette
```
--cream:        #F5F0E8   (page background — warm, editorial)
--cream-card:   #FAFAF7   (card surfaces)
--black:        #1A1A1A   (primary text — warm near-black)
--gray:         #6B6560   (secondary text)
--gray-light:   #D4CFC8   (borders, dividers)
--green:        #1B5E3B   (accent — deep Nigerian green)
--green-light:  #E8F5EE   (accent backgrounds, callouts)
--dark:         #0F0F0D   (dark sections — newsletter CTA etc)
--dark-card:    #1C1C1A   (cards within dark sections)
--white:        #FFFFFF   (text on dark backgrounds)
```

### Typography Scale
```
Display:  Playfair Display, serif — 72px/80px, weight 700
H1:       Playfair Display, serif — 48px/56px, weight 700
H2:       Playfair Display, serif — 36px/44px, weight 600
H3:       DM Sans, sans-serif    — 24px/32px, weight 600
H4:       DM Sans, sans-serif    — 20px/28px, weight 600
Body:     DM Sans, sans-serif    — 16px/28px, weight 400
Small:    DM Sans, sans-serif    — 14px/22px, weight 400
Label:    DM Sans, sans-serif    — 12px/18px, weight 500, uppercase, 
                                   letter-spacing: 0.08em
```

### Spacing Philosophy
Paperclip-style: generous, almost uncomfortable whitespace.
Sections: 120px vertical padding minimum on desktop.
Cards: 40px internal padding.
Never feel cramped. Let content breathe.

### Component Patterns
- Buttons: solid green (#1B5E3B), white text, no border-radius or 
  small 4px radius only. No rounded pills.
- Cards: white/cream background, 1px border (#D4CFC8), subtle 
  hover lift (translateY -2px, shadow increase).
- Section numbers: small gray label text above headings (like 
  Paperclip's "01", "02", "03").
- Dark sections: #0F0F0D background, white text, green accents.

---

## Site Architecture

### Pages to Build (in order)

1. `/` — Homepage
2. `/savings` — Savings & Yields pillar
3. `/fight-back` — Consumer advocacy pillar  
4. `/grow` — Grow Money pillar
5. `/cut-costs` — Cut Costs pillar
6. `/news` — News & Guides pillar
7. `/articles/[slug]` — Individual article page
8. `/tools/naira-erosion-calculator` — Standalone tool page
9. `/newsletter` — Newsletter signup page
10. `/about` — About NairaSavvy

### Homepage Sections (EXACT ORDER)

```
1. NAV
   Logo (NairaSavvy wordmark) + nav links + "Get Free Alerts" CTA button

2. HERO
   Large display headline: "Nigeria's financial system wasn't built for you."
   Second line (green accent): "NairaSavvy was."
   Subheading: "Free guides, tools, and alerts to protect your money, 
   fight back against banks, and grow what you have."
   Email signup form (inline: input + button)
   Social proof line: "Join 0 Nigerians protecting their money" 
   (update dynamically from Supabase count)

3. THREE PILLARS (like Paperclip's 01/02/03 cards)
   Card 01 — PROTECT
   "Stop your savings from being eaten alive by inflation."
   Card 02 — FIGHT BACK  
   "Banks fail you. We give you the tools to fight back."
   Card 03 — GROW
   "Find every legal edge to make your money work harder."

4. NAIRA-GUARD LIVE DASHBOARD
   Section heading: "Is your money working hard enough?"
   Embedded live APY comparison table
   Shows: Bank name | Product | APY | vs Inflation | Verdict
   Updates from Supabase
   CTA: "See full analysis →"

5. LATEST ARTICLES (editorial grid)
   Section heading: "What you need to know this week"
   3-column grid of latest article cards
   Each card: category tag + headline + excerpt + read time
   CTA: "See all guides →"

6. NAIRA EROSION CALCULATOR
   Dark section (#0F0F0D)
   Heading: "See exactly how much your savings are losing."
   Embedded interactive calculator
   Input: amount + months
   Output: real value + loss in naira + visual bar chart
   CTA: "Learn how to stop the erosion →"

7. NEWSLETTER CTA (full-width dark section)
   Heading: "The Naira Shield — free weekly intelligence."
   Sub: "Every week: best rates, bank alerts, your rights, 
   and the moves smart Nigerians are making."
   Email form
   
8. FOOTER
   Logo + tagline
   Nav links by pillar
   Legal: disclaimer, privacy, terms
   "Not financial advice. We are a financial education platform."
```

---

## Content Structure

### Article MDX Format
Every article in `/content/articles/` follows this frontmatter:

```mdx
---
title: "Article headline here"
slug: "url-friendly-slug"
excerpt: "155 char excerpt for SEO meta and card previews"
category: "savings | fight-back | cut-costs | grow | news"
publishedAt: "2026-03-28"
updatedAt: "2026-03-28"
readTime: 5
featured: false
keywords: ["keyword1", "keyword2", "keyword3"]
seoTitle: "SEO title max 60 chars"
metaDescription: "Meta description max 155 chars"
---
```

### Article Body Structure (enforce with MDX components)
Every article uses these custom MDX components:

```
<Hook>        — Opening scenario paragraph
<Problem>     — What's happening, with data
<NeedToKnow>  — Expert context and facts
<ActionSteps> — Concrete numbered steps
<BottomLine>  — Sharp one-paragraph summary
<NewsletterCTA> — Inline newsletter signup
<DefinitionBlock term="X"> — For AI SEO citability
<ComparisonTable>           — For AI SEO citability  
<FAQBlock>                  — For AI SEO citability
<StatBlock source="X" year="2026"> — Attributed statistics
```

---

## AI SEO Requirements (bake into every page)

### robots.txt (create at /public/robots.txt)
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://nairasavvy.ng/sitemap.xml
```

### Schema Markup (add to every page type)
- Homepage: Organization schema
- Articles: Article + FAQPage schema (if FAQ section present)
- Tool pages: WebApplication schema
- Category pages: CollectionPage schema

### SEO Defaults (in layout.tsx)
Every page must have:
- Unique title tag (format: "Topic | NairaSavvy")
- Unique meta description
- Canonical URL
- Open Graph tags (title, description, image, url)
- Twitter Card tags
- JSON-LD structured data

### Content Patterns for AI Citability
Every article page must include at minimum:
- One DefinitionBlock in first 300 words
- One set of numbered ActionSteps
- One StatBlock with attributed source
- FAQBlock at bottom with 3-5 Q&A pairs
- Author attribution line: "By NairaSavvy Editorial Team | Verified [date]"

---

## Database Schema (Supabase)

### Tables to Create

```sql
-- Articles (for dynamic fetching, mirrors MDX content)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  read_time INT,
  featured BOOLEAN DEFAULT false,
  keywords TEXT[],
  view_count INT DEFAULT 0
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- which page/form they signed up from
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true
);

-- APY rates (for Naira-Guard dashboard)
CREATE TABLE apy_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT, -- savings | monemarket | neobank | wealthtech
  apy_percent DECIMAL(5,2) NOT NULL,
  min_balance BIGINT DEFAULT 0,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  source_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Inflation reference
CREATE TABLE inflation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_percent DECIMAL(5,2) NOT NULL,
  period TEXT NOT NULL, -- e.g. "March 2026"
  source TEXT DEFAULT 'NBS',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content pipeline queue (for Scout/Writer agent output)
CREATE TABLE content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  brief JSONB,
  full_article TEXT,
  status TEXT DEFAULT 'pending', -- pending|approved|rejected|published
  quality_score INT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);
```

---

## API Routes to Build

```
POST /api/subscribe          — Newsletter signup
GET  /api/rates              — Fetch live APY rates from Supabase
GET  /api/articles           — Fetch article list (with filters)
GET  /api/articles/[slug]    — Fetch single article
POST /api/content/approve    — Webhook: approve queued article
POST /api/content/reject     — Webhook: reject queued article
GET  /api/inflation          — Current inflation rate
GET  /api/sitemap            — Dynamic sitemap generation
```

---

## Components to Build

### Global
- `<Nav />` — Sticky, transparent on hero, solid on scroll
- `<Footer />` — Full site footer
- `<NewsletterForm />` — Reusable email capture (used in 4+ places)

### Homepage
- `<Hero />` — Full-width, large type, email form
- `<PillarCards />` — 3-card section (01/02/03 style)
- `<NairaGuardDashboard />` — Live APY table with inflation overlay
- `<ArticleGrid />` — 3-column editorial card grid
- `<ErosionCalculator />` — Interactive tool (see spec below)
- `<NewsletterCTA />` — Dark full-width section

### Article Pages
- `<ArticleHeader />` — Category + title + meta + author
- `<ArticleBody />` — MDX renderer with custom components
- `<SidebarTools />` — Related tools sidebar
- `<RelatedArticles />` — Bottom article recommendations
- `<ShareButtons />` — Twitter/X, WhatsApp, copy link

### Tools
- `<ErosionCalculator />` — PRIORITY: build this first
  * Inputs: principal amount (₦), months (1-36 slider), 
    inflation rate (pre-filled, editable)
  * Outputs: nominal value, real value, naira lost
  * Visual: two-bar comparison (green nominal, red real)
  * Copy: "Your ₦[X] will be worth ₦[Y] in [Z] months"
  * No backend required — pure React useState

---

## Performance Requirements

- Lighthouse score: 90+ on all metrics
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Images: Next.js Image component only (no raw img tags)
- Fonts: next/font for zero layout shift
- Bundle: code-split by route, lazy load below-fold components

---

## Build Order (follow this sequence)

```
Phase 1 — Foundation
  1. Project scaffold (npx create-next-app)
  2. Design system (tailwind.config + CSS variables + fonts)
  3. Supabase setup (tables + client)
  4. Layout + Nav + Footer

Phase 2 — Homepage
  5. Hero section
  6. Pillar cards
  7. Erosion Calculator (standalone component first)
  8. Newsletter form + API route
  9. Article grid (static placeholder data)
  10. Full homepage assembly

Phase 3 — Content System
  11. MDX setup + custom components
  12. Article page template
  13. 3 sample articles as MDX files
  14. Category pages

Phase 4 — Live Data
  15. NairaGuard dashboard (Supabase APY data)
  16. Inflation overlay
  17. Content queue API routes

Phase 5 — SEO & Launch
  18. Metadata system (layout.tsx)
  19. Schema markup (JSON-LD)
  20. robots.txt + sitemap
  21. Vercel deployment
```

---

## Voice & Copy Rules

Every piece of copy on the site must sound like:
"A brilliant Nigerian friend who knows finance deeply, talks 
straight, understands the hustle, and is always on your side."

Rules:
- Never condescending
- Always specific (name the bank, name the rate, name the law)
- Occasionally Nigerian in expression — but never forced
- Numbers over adjectives ("42% APY" beats "high yield")
- Action-oriented ("Here's how to fight back" beats "Learn more")
- Acknowledge the pain before offering the solution

---

## Legal Disclaimers (required on every page)

Footer must include:
"NairaSavvy is a financial education and information platform. 
Nothing on this site constitutes financial advice. Always verify 
current rates and consult a qualified financial advisor before 
making investment decisions. We may earn affiliate commissions 
from some links — these are always clearly labelled."

---

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://nairasavvy.ng
CONTENT_WEBHOOK_SECRET=
```
