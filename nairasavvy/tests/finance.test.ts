import test from "node:test";
import assert from "node:assert/strict";
import { erosion, realReturn, isFresh, safeUrl } from "../src/lib/finance";
import { gbPerThousand } from "../src/lib/data-plan-value";
import { complaintLetter } from "../src/lib/complaint";
test("price increase and purchasing-power loss use different bases", () => {
  const r = erosion(100000, 20, 1)!;
  assert.equal(r.futureCost, 120000);
  assert.ok(Math.abs(r.loss - 16666.6666667) < 0.001);
  assert.equal(r.loss + r.purchasingPower, 100000);
});
test("zero inflation and zero years preserve purchasing power", () => {
  assert.equal(erosion(100000, 0, 10)?.loss, 0);
  assert.equal(erosion(100000, 20, 0)?.loss, 0);
  assert.equal(erosion(0, 20, 10)?.loss, 0);
});
test("invalid or extreme inputs do not generate misleading results", () => {
  for (const args of [
    [-1, 20, 1],
    [1, -100, 1],
    [1, 20, -1],
    [Infinity, 20, 1],
    [1, 20, 51],
    [1, NaN, 1],
  ])
    assert.equal(erosion(...(args as [number, number, number])), null);
});
test("real return is not the percentage-point gap", () => {
  assert.ok(Math.abs(realReturn(10, 20) + 8.333333333) < 0.00001);
  assert.equal(realReturn(20, 20), 0);
});
test("unverified and future observations cannot be called fresh", () => {
  const now = Date.parse("2026-09-14");
  assert.equal(isFresh(null, 30, now), false);
  assert.equal(isFresh("2026-09-15", 30, now), false);
  assert.equal(isFresh("2026-04-01", 30, now), false);
  assert.equal(isFresh("2026-09-01", 30, now), true);
  assert.equal(safeUrl("javascript:alert(1)"), null);
});
test("restricted bonuses never count by default or without terms", () => {
  const p = { data_gb: 2, price_naira: 1000, night_bonus_gb: 4 };
  assert.equal(gbPerThousand(p), 2);
  assert.equal(gbPerThousand(p, true), 2);
  assert.equal(
    gbPerThousand({ ...p, bonus_restrictions: "Night only" }, true),
    6,
  );
});
test("complaint draft includes user evidence without inventing legal deadlines", () => {
  const r = complaintLetter({
    name: "Test Person",
    bank: "Test Bank",
    issue: "Failed transaction",
    date: "2026-09-01",
    amount: "1000",
    reference: "REF1",
    details: "Debited once; recipient not credited.",
    resolution: "Investigate and reverse if failed.",
    previous: "Ticket ABC",
    contact: "",
  });
  assert.match(r!, /REF1/);
  assert.match(r!, /Ticket ABC/);
  assert.doesNotMatch(r!, /72 hours|5 business days/);
});
