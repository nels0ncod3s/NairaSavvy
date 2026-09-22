# Scout → Bayo → Sendy: operator guide

The executable workers live in `src/lib/agents/`, with a CLI in `scripts/agents.ts`. They run outside the web request lifecycle. Public, reviewed stories appear at `/briefings` and `/briefings/<id>`, linked from News. This is a working initial pipeline, not a deployed or enabled service.

## What each worker does

- **Scout:** reads an explicit source registry, fetches RSS/Atom or configured HTML listings, cleans markup, retains source/publication/collection dates, and deduplicates canonical URLs. It checks robots.txt, validates the actual DNS answers used for connections, rejects off-list redirects/private IPs, and caps time, size and item count. Source failures and empty feeds are recorded. It does not crawl arbitrary links, bypass paywalls, or infer missing financial figures.
- **Bayo:** categorises and prepares reviewable drafts. `BAYO_MODE=source` produces an attributed source briefing without an AI service. `BAYO_MODE=ai` uses OpenAI Responses with structured JSON to write an original short summary from the title/excerpt. The model has no tools or subscriber data; code fixes provenance, validates output and rejects invented numeric values. These checks do not prove financial accuracy: an editor must read the original source. Failed model requests remain uncurated for the next run. Published briefings are rendered as plain React text, never executed as MDX/HTML.
- **Sendy:** sends approved, frozen editions through SendByte's per-recipient email API, with one-click unsubscribe, a persistent queue, unique edition/subscriber pairs, provider IDs, signature-verified lifecycle callbacks and a pause switch. It rechecks `active AND confirmed` immediately before each request. It is ordinary delivery code, not an LLM.

The original `.github/agents/` prompt files are retained; these workers are the actual implementation. Cross-publisher event clustering, general financial API connectors, rate-table extraction, an admin dashboard and automatic financial fact-checking are not implemented. Identical canonical URLs deduplicate; different publications covering the same event remain separate for the editor to select.

## 1. Install and configure

Use Node 22.19+ and run `npm ci` in `nairasavvy/`. Copy `.env.example` to `.env.local` and configure the Supabase URL/public key plus a server-only secret/service-role key. Apply SQL in this order to the intended Supabase project:

1. `src/lib/supabase/schema.sql`
2. `src/lib/supabase/upgrade.sql`
3. `supabase/migrations/20260917072149_agent_pipeline.sql` (once)

The new migration must be applied before any worker runs. Raw items, review drafts, editions, delivery tokens, subscriber IDs and run logs are private. Anonymous clients can select only the published briefing ID, content and publication date. The application uses the public key for public reads. Privileged RPCs use SECURITY INVOKER and are executable only by service_role. Worker credentials must never enter browser code or version control. The current workers share the service-role credential; separate restricted worker roles would be a future hardening step.

Review `agents/sources.json`. Example feeds are **disabled**: inspect the publisher's current terms, robots policy and permitted excerpts, then set `enabled: true`. Keep every permitted redirect host in `hosts`. For an HTML listing set `itemSelector`, `titleSelector`, `linkSelector` and optional `excerptSelector`/`dateSelector`. Selectors are relative to each item. No enabled source is a visible error, not a silent successful run.

For optional AI summaries set `BAYO_MODE=ai`, `OPENAI_API_KEY` and `BAYO_MODEL` to a model in your account that supports Responses structured output. Source-only mode is the default. Each invocation handles at most 200 uncurated items, sequentially; configure API spend limits and start with a small source list. Model timeout is 45 seconds per item. No paid model requests are necessary to run the tests.

## 2. Collect and review

```bash
npm run agents -- scout
npm run agents -- bayo
npm run agents -- list
npm run agents -- export DRAFT_UUID review.json
```

Open the exported JSON. Check the linked original, publication date, numerical claims, relevance and excerpt rights. You can edit `content.title`, `category`, `paragraphs` and `flags` while retaining `id` and `revision`.

```bash
npm run agents -- edit review.json
npm run agents -- export DRAFT_UUID review-final.json
npm run agents -- publish DRAFT_UUID REVISION_FROM_FINAL_EXPORT "Nelson Wey"
# Or discard a draft:
npm run agents -- reject DRAFT_UUID
```

Publishing checks the exact reviewed revision and records the reviewer. Changed/already reviewed drafts cannot be approved from stale exports. Review is a privileged CLI operation; there is no public publishing endpoint. One published draft becomes one briefing URL immediately; no site rebuild is required. Missing source dates remain visibly missing.

## 3. Prepare a newsletter

Choose published briefing IDs, in reading order. The `edition` command is the editorial approval action: inspect every selected briefing before running it. It copies content into an immutable snapshot.

```bash
npm run agents -- edition "The Naira Shield: this week's money news" "Nelson Wey" BRIEF_UUID_1 BRIEF_UUID_2
npm run agents -- preview EDITION_UUID preview.html
```

Open the HTML preview locally. It contains a deliberately invalid placeholder unsubscribe token and sends nothing. After checking subject, copy, links and layout:

```bash
npm run agents -- queue EDITION_UUID
npm run agents -- status
```

Queueing freezes the currently eligible audience once. Pending/unconfirmed and inactive subscribers are excluded. Rerunning queue does not add recipients or duplicate jobs. Newsletter tokens belong to deliveries, so newer editions never invalidate old unsubscribe links. Unsubscribing deletes the subscription using the existing application's deletion convention; delivery records retain status but lose their subscriber reference. A future signup must reconfirm and receives a new subscriber identity.

## 4. Configure SendByte and test delivery

Set a live `SENDBYTE_API_KEY`, verified `SENDBYTE_FROM_EMAIL`, and HTTPS `NEXT_PUBLIC_SITE_URL`. Sandbox keys do not count as successful delivery. In SendByte register `/api/webhooks/sendbyte` for `email.delivered`, `email.bounced`, `email.complained` and `email.unsubscribed`, and save that endpoint's secret as `SENDBYTE_WEBHOOK_SECRET`. Signatures use the SDK verifier over the raw body. Suppression events are transactionally deduplicated; other repeated callbacks read current provider state and are idempotent.

Start in an isolated staging database with **only your confirmed test subscription**. Queue a reviewed test edition there, set `AGENTS_SEND_ENABLED=true`, and run:

```bash
npm run agents -- send 1
npm run agents -- status
```

Verify actual inbox delivery, source links, browser unsubscribe, one-click POST unsubscribe and a replayed signed webhook. Then set `AGENTS_SEND_ENABLED=false` again until ready. `queued` means provider accepted the email, not that it reached the inbox. Worker invocations send at most 100 requests, default 20, and reconcile up to 100 prior queued/sent jobs first. There is no automatic daily quota; choose operational batch size and frequency deliberately.

The initial implementation uses SendByte's documented email API and RFC 8058 support to preserve Supabase as the consent authority. It does **not** migrate people into a second SendByte marketing list. Before large-volume sending, agree the bulk-mail setup with SendByte or deliberately migrate to marketing campaigns with consent/suppression synchronisation; do not run both systems independently.

## Failures and restarts

A SQL claim uses row locks and SKIP LOCKED. Two workers cannot claim the same pending job. Every outbound request has a stable `edition:<delivery-id>` idempotency key. SDK automatic retries are disabled.

If sending or saving the provider response fails, the job becomes `uncertain` and the batch stops. A crashed process may leave `sending`. Neither state is automatically retried: this avoids duplicates beyond any provider idempotency retention window. Inspect SendByte logs using the idempotency key. If accepted, attach its verified provider ID to the private job and run `npm run agents -- reconcile PROVIDER_ID`. Only reset a job to pending after positively establishing that the provider never accepted it. Never blindly reset every uncertain job. Provider failures are not reported as successful sends.

Signed bounce, complaint and unsubscribe events immediately suppress the subscriber. A final consent check substantially narrows the unsubscribe/send race, but an email already accepted by the provider cannot be recalled. Disable sending while investigating a delivery problem. Use `status` for the latest 100 jobs/20 source runs; query the private tables for older history. Retain delivery deduplication records while an edition can be rerun; establish a retention policy for raw items/logs before high-volume operation.

## Scheduling

Nothing is scheduled or enabled by this PR. After staging verification, use your existing scheduler/worker host to run Scout then Bayo a few times a day and Sendy against queued, editor-approved editions. Keep publication/edition approval manual. Do not put service keys in workflow arguments or expose an unauthenticated cron endpoint. A persistent Node worker is preferable to short-lived request handlers for scraping/model batches.

## Validation and references

`npm test` covers feed parsing, network destination rules, model output validation, newsletter escaping, consent, failures, database grants/RLS, revision checks, queue uniqueness and claiming. `npm run test:e2e` exercises the website with external services disabled. Live inbox delivery, actual publisher access and a paid model response still need environment-specific checks.

- https://docs.sendbyte.africa/sdks/node
- https://docs.sendbyte.africa/guides/webhooks
- https://docs.sendbyte.africa/guides/idempotency
- https://docs.sendbyte.africa/guides/marketing
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://supabase.com/docs/guides/database/postgres/row-level-security
