# NairaSavvy

Consumer money guides and comparison tools for Nigerians. Next.js 16 App Router, React 19, TypeScript, MDX, Supabase and Resend.

## Local development

Requires Node.js 22 or later.

```bash
cd nairasavvy # if starting from the repository root
npm ci
cp .env.example .env.local
npm run dev
```

Without external credentials, all public routes still work. Savings/news data show unavailable states; historical data plans are opt-in; the calculator uses a labelled illustrative rate. Newsletter signup returns 503 instead of pretending to subscribe someone.

## Configure the database and newsletter

1. Use the Supabase project belonging to NairaSavvy. Do not point this app at another product's database.
2. Run `src/lib/supabase/schema.sql`, then `src/lib/supabase/upgrade.sql` in that project. Both scripts are repeatable. Upgrade aborts on case-insensitive duplicate emails rather than merging consent records. Resolve any such duplicates deliberately before retrying.
3. Set the public Supabase URL and publishable key, plus a server-only Supabase secret key. Legacy anon/service-role keys remain supported.
4. Set `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin.
5. Verify one signup, confirmation and unsubscribe with an address you control before promoting the release. No production email was sent during development tests.

New signups are inactive until confirmed. Confirmation tokens expire after 24 hours, are hashed in the database, and are single-use. Opening a link does not change subscription state: confirmation and unsubscribe require a POST. Unsubscribe deletes the subscriber record. Only send newsletters to records with BOTH `confirmed=true` and `active=true` and include a working unsubscribe link. The confirmation flow is implemented; editorial newsletter composition/scheduling remains an operator responsibility. Unsubscribe raw tokens are only present in the email, so future sending code must generate a new token and persist its hash before including a new link.

Subscriber access and throttling RPCs are service-role-only. A distributed per-address cooldown permits one signup request/minute; a global 60 requests/minute circuit breaker limits email abuse. Add provider/WAF protections appropriate to traffic volume. Neither API keys nor full emails are logged by the signup route. Operational rate-limit records expire after two days on subsequent use. Regularly delete unconfirmed signups older than your chosen retention period; confirm the published policy reflects that period before public rollout.

## Publish reviewed data

The schema deliberately contains no financial-rate seeds. Populate source URLs and review dates after checking primary sources.

- `apy_rates`: currency (`NGN` or `USD`), annual yield, rate basis, access terms, fees, risk notes, source URL and `verified_at`. Unknown currency is never guessed. Inflation verdicts require a recent sourced NGN observation.
- `inflation_data`: published rate, period, source name, primary source URL and `recorded_at`. An observation older than 60 days is not used as the current benchmark. Do not refresh the timestamp without reviewing the observation.
- `data_plans`: ordinary data allowance, bonus amount and restrictions, price, validity, eligibility, source URL and `verified_at`. Only reviewed observations within 30 days appear by default.

Changing records are read on request; public reads do not use visitor auth cookies. Request failures are bounded and render unavailable states.

## Content

Articles live in `content/articles/*.mdx`. `reviewRequired: true` marks legacy stories awaiting review; they show an archival warning, are noindex and are omitted from the sitemap. `updatedAt` records corrections. Remove the review flag only after checking the article's claims. MDX is trusted repository code: do not accept arbitrary user MDX or automatically execute unreviewed generated content. Scout and Bayo definitions are unchanged.

Three new evergreen guides cover comparison methods without quoting current market rates. The bank letter tool generates editable text locally and does not transmit personal details.

## Quality checks

```bash
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Tests cover money calculations, currency/source gates, newsletter validation and mocked delivery, SQL privacy and atomic cooldowns, route availability without services, mobile navigation, filtering, article categories and letter download. Tests never send real email. Browser tests use a clean unconfigured app on localhost:3099.

## Deployment

The actual application directory is `nairasavvy`. For Vercel, set Root Directory to `nairasavvy`, use its build settings, and configure the environment variables above. The repository-level wrapper is retained for existing root-directory deployments. GitHub Actions checks live at the repository root in `.github/workflows/ci.yml`. Use Vercel Git integration for preview/production deployment; CI does not contain a second production publisher.

The optional `/api/deploy` hook still requires `CONTENT_WEBHOOK_SECRET` and `VERCEL_DEPLOY_HOOK_URL`. Never expose those values to clients.

## Release checklist

- Apply schema and upgrade to the correct project; check RLS policies and grants.
- Populate reviewed comparison data and configure a verified sender.
- Test confirmation/unsubscribe with a controlled address; do not import unconfirmed legacy rows into a mailing campaign.
- Check the configured canonical origin, contact address and privacy policy against actual operations.
- Review the archived market stories before removing their warning.
