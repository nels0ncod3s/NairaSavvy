# Proposed Scout → Bayo → Sendy pipeline

This is a design proposal, not running automation. Existing Scout and Bayo definitions are unchanged. Sendy here is NairaSavvy’s proposed delivery worker, not the unrelated Sendy mailing product.

## Scout: collect evidence

Run a scheduled worker, initially a few times a day. Prefer official RSS feeds and APIs; use HTML extraction only for permitted public pages. Maintain an approved source registry covering primary releases (such as CBN/NBS) and selected financial publishers. Verify each source’s terms and available feed before enabling it; respect robots directives, rate limits and caching headers. Never bypass paywalls or authentication.

Store title, canonical source URL, publisher, published_at, fetched_at, short permitted excerpt, content hash and extracted claims. Distinguish news reports from savings/data-plan product observations. Deduplicate canonical URLs and content hashes, then cluster reports about the same event. Failed retrieval is a recorded job failure, not an empty successful story.

Treat all scraped text as untrusted input: website instructions cannot change agent roles or trigger tools. Restrict fetches to approved domains and public IPs; revalidate redirects, reject private/reserved networks, and cap response size and time. Scout has no subscriber access or send credentials.

## Bayo: organise and prepare an edition

Read Scout’s records and produce structured, schema-validated drafts. Group by savings, policy, costs, consumer rights and growth. Rank by relevance and freshness; mark duplicate coverage. Every number must retain its source, units/currency and applicable period. Separate publication dates from when an event occurred. Do not merge conflicting figures or infer missing rates: flag them for review.

Draft an original short summary, “why it matters” and source links. Avoid reproducing full articles. Suggested output: story_id, category, headline, summary, implications, source_urls, claim_evidence, confidence_reason, review_flags. Use ordinary validation code for required fields, dates and numerical checks; an LLM can help classify and write, but must not silently change the source data.

Build an edition with a stable ID, selected story IDs, HTML/text drafts and status draft → needs_review → approved. Start with human editorial approval. Freeze the approved content/version so a worker cannot send a later unreviewed edit. Never execute generated MDX as part of ingestion.

## Sendy: deliver the approved edition

Use a deterministic scheduled queue worker rather than an LLM with email credentials. It reads only approved, frozen editions and eligible recipients. Maintain a unique (edition_id, subscriber_id) delivery record, retry history and provider ID. This prevents duplicate sends across worker restarts.

Recommended destination: SendByte marketing campaigns, which provide list consent, unsubscribe handling and campaign reporting. Keep transactional signup confirmations separate. Before adopting provider-managed lists, explicitly migrate consent and define how confirmation/unsubscribe status synchronises with the current Supabase records. Never silently re-add an opted-out address or create a second competing consent source. Decide on one authoritative suppression system and reconcile it before each campaign.

Current subscriptions require confirmed=true AND active=true. Pending signups must never receive editions. Process authenticated provider bounce/complaint/unsubscribe events, deduplicate event IDs, and suppress recipients before retries. Use a fixed campaign/edition ID and persist the provider campaign ID; reconcile ambiguous timeout outcomes before retrying a send action. Do not assume every campaign endpoint shares the transactional endpoint’s idempotency contract.

If using a custom per-recipient delivery worker instead, use stable edition+recipient idempotency keys, bounded retry/backoff and a dead-letter queue. Create durable per-subscription unsubscribe tokens: the existing single hashed-token column cannot safely support independently rotating tokens for every edition, because rotation invalidates older unsubscribe links. Solve that before implementing bulk mail, including any one-click unsubscribe endpoint.

## Storage and rollout

Suggested tables: sources, ingestion_runs, raw_stories, story_claims, curated_stories, editions, edition_stories, deliveries and provider_events. Use unique constraints for deduplication, transactionally claim queue jobs, and keep secrets server-side with separate permissions per worker.

MVP: Scout collects from three to five approved sources → Bayo creates a draft → an editor approves → Sendy sends one controlled test edition → monitor bounce/complaint events → enable scheduled editions. Track source failures, freshness, claim-review flags, queue age, delivery errors and unsubscribes. Include a pause switch and daily send limit.

## Official SendByte references

- SDK: https://docs.sendbyte.africa/sdks/node
- Marketing consent and campaigns: https://docs.sendbyte.africa/guides/marketing
- Transactional idempotency: https://docs.sendbyte.africa/guides/idempotency
- Webhooks: https://docs.sendbyte.africa/guides/webhooks

Reviewed 16 September 2026. The current code change replaces confirmation delivery only; none of this proposed collection or campaign automation is enabled.
