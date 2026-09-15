import test from "node:test";
import assert from "node:assert/strict";
import {
  subscribe,
  subscriptionSchema,
  tokenHash,
  tokenSchema,
} from "../src/lib/newsletter";
import { computeVerdict } from "../src/lib/data/apy-rates";
import type { ApyRate } from "../src/lib/supabase/types";
test("email validation normalizes addresses and rejects malformed inputs", () => {
  assert.equal(
    subscriptionSchema.parse({ email: "  USER@EXAMPLE.COM  " }).email,
    "user@example.com",
  );
  for (const email of ["bad", 42, "a@"])
    assert.equal(subscriptionSchema.safeParse({ email }).success, false);
  assert.equal(
    subscriptionSchema.safeParse({ email: "a@example.com", website: "spam" })
      .success,
    false,
  );
  assert.equal(tokenSchema.safeParse("bad").success, false);
});
test("currency and source quality gate financial verdicts", () => {
  const rate: ApyRate = {
    id: "1",
    institution: "Example",
    product_name: "Savings",
    product_type: "savings",
    currency: "USD",
    apy_percent: 10,
    min_balance: 0,
    verified_at: new Date().toISOString(),
    source_url: "https://example.com/rate",
    is_active: true,
    rate_type: "APY",
    access_terms: null,
    fees: null,
    risk_notes: null,
  };
  assert.equal(computeVerdict(rate, 20).real_return, null);
  assert.equal(
    computeVerdict({ ...rate, currency: "NGN", source_url: null }, 20)
      .real_return,
    null,
  );
  assert.equal(
    computeVerdict({ ...rate, currency: "NGN", verified_at: "2020-01-01" }, 20)
      .real_return,
    null,
  );
  assert.ok(computeVerdict({ ...rate, currency: "NGN" }, 20).real_return! < 0);
});
test("newsletter persists hashed tokens and reports provider failures, duplicates and cooldowns", async () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://newsletter-test.invalid";
  process.env.SUPABASE_SECRET_KEY = "test-secret";
  process.env.RESEND_API_KEY = "test-email-key";
  process.env.RESEND_FROM_EMAIL = "test@example.com";
  let row: Record<string, unknown> | null = null;
  let sent = 0;
  let allow = true;
  let failEmail = false;
  let emailBody = "";
  global.fetch = async (input, init) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body ?? "{}"));
    const response = (data: unknown, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    if (url.startsWith("https://api.resend.com/")) {
      sent++;
      emailBody = body.text;
      return failEmail
        ? response({ name: "validation_error", message: "Mock failure" }, 422)
        : response({ id: "email-id" });
    }
    assert.ok(
      url.startsWith("https://newsletter-test.invalid/"),
      "Tests must never contact external services",
    );
    if (url.includes("/rpc/newsletter_allow_request")) return response(allow);
    if (init?.method === "POST") {
      if (!row) row = { id: "subscriber-id", ...body };
      return new Response(null, { status: 201 });
    }
    if (init?.method === "PATCH") {
      row = { ...row, ...body };
      return new Response(null, { status: 204 });
    }
    return response(row);
  };
  try {
    const result = await subscribe({
      email: "user@example.com",
      source: "/newsletter",
    });
    assert.equal(result.status, 202);
    assert.equal(sent, 1);
    assert.equal(row!.confirmed, false);
    assert.equal(row!.active, false);
    const raw = emailBody.match(/confirm\?token=([a-f0-9]{64})/)![1];
    assert.equal(row!.confirmation_hash, tokenHash(raw));
    assert.notEqual(row!.confirmation_hash, raw);
    assert.match(emailBody, /unsubscribe\?token=/);
    failEmail = true;
    assert.equal(
      (await subscribe({ email: "user@example.com", source: "/newsletter" }))
        .status,
      503,
    );
    row!.active = true;
    row!.confirmed = true;
    const before = sent;
    assert.equal(
      (await subscribe({ email: "user@example.com", source: "/newsletter" }))
        .status,
      202,
    );
    assert.equal(sent, before);
    allow = false;
    assert.notEqual(
      (await subscribe({ email: "user@example.com", source: "/newsletter" }))
        .status,
      202,
    );
  } finally {
    global.fetch = originalFetch;
    for (const key of Object.keys(process.env))
      if (!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env, originalEnv);
  }
});
