"use client";
import { useState } from "react";
import type { DataPlan } from "@/lib/data/data-plans";
import { isFresh, safeUrl } from "@/lib/finance";
import { gbPerThousand } from "@/lib/data-plan-value";
export default function DataPlansClient({
  allPlans,
}: {
  allPlans: DataPlan[];
  hiddenDeals?: DataPlan[];
}) {
  const [network, setNetwork] = useState("All");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [gb, setGb] = useState("");
  const [bonus, setBonus] = useState(false);
  const [historical, setHistorical] = useState(false);
  const [message, setMessage] = useState("");
  const verified = (p: DataPlan) =>
    !p.historical && !!safeUrl(p.source_url) && isFresh(p.verified_at, 30);
  const validFilters = [budget, days, gb].every(
    (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0),
  );
  const plans = validFilters
    ? allPlans
        .filter(
          (p) =>
            (network === "All" || p.network === network) &&
            (historical || verified(p)) &&
            (!budget || p.price_naira <= Number(budget)) &&
            (!days ||
              (p.validity_days !== null && p.validity_days >= Number(days))) &&
            (!gb || p.data_gb >= Number(gb)),
        )
        .sort((a, b) => gbPerThousand(b, bonus) - gbPerThousand(a, bonus))
    : [];
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Activation instructions copied.");
    } catch {
      setMessage(
        "Copy is unavailable. Select the activation instructions and copy them manually.",
      );
    }
  }
  return (
    <section className="ns-section">
      <div className="container-content">
        <h2 className="type-h2">Find a plan that fits</h2>
        <p>
          Compare ordinary data first. Bonus data only counts when its
          restrictions are recorded and you choose to include it.
        </p>
        <div className="tool-panel form-grid">
          <label>
            Network
            <select
              className="input"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
            >
              {["All", ...new Set(allPlans.map((p) => p.network))].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Maximum budget (₦)
            <input
              className="input"
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Any"
            />
          </label>
          <label>
            Minimum validity (days)
            <input
              className="input"
              type="number"
              min="0"
              step="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Any"
            />
          </label>
          <label>
            Minimum ordinary data (GB)
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              value={gb}
              onChange={(e) => setGb(e.target.value)}
              placeholder="Any"
            />
          </label>
        </div>
        <p>
          <label>
            <input
              type="checkbox"
              checked={bonus}
              onChange={(e) => setBonus(e.target.checked)}
            />{" "}
            Include documented restricted bonus data in ranking
          </label>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              checked={historical}
              onChange={(e) => setHistorical(e.target.checked)}
            />{" "}
            Show historical or unverified records
          </label>
        </p>
        {!validFilters && (
          <p role="alert">Filters must be zero or positive numbers.</p>
        )}
        <p role="status">
          {plans.length} matching plans. Ranked by GB per ₦1,000
          {bonus ? ", including documented bonuses" : ", ordinary data only"}.
        </p>
        {!plans.length && (
          <div className="tool-panel">
            <p>
              No recently verified plans match. Broaden your filters or view
              historical records. Confirm current prices and eligibility
              directly with your network before purchasing.
            </p>
          </div>
        )}
        <div className="plan-grid">
          {plans.map((p) => (
            <article className="card" key={p.id}>
              <span className="category-tag">{p.network}</span>
              <h3 className="type-h3">{p.plan_name}</h3>
              <p>
                <strong>₦{p.price_naira.toLocaleString("en-NG")}</strong> ·{" "}
                {p.data_gb} GB ordinary data
              </p>
              <p>
                Validity:{" "}
                {p.validity_days === null
                  ? "Not supplied"
                  : `${p.validity_days} days`}
              </p>
              <p>Value: {gbPerThousand(p, bonus).toFixed(2)} GB / ₦1,000</p>
              {p.night_bonus_gb > 0 && (
                <p>
                  Bonus: {p.night_bonus_gb} GB.{" "}
                  {p.bonus_restrictions ??
                    "Restrictions not verified; excluded from ranking."}
                </p>
              )}
              <p>
                Eligibility:{" "}
                {p.eligibility ?? "Check your account with the provider."}
              </p>
              <p className="type-small">
                {p.historical
                  ? "Historical example from April 2026; source not verified. Do not rely on this price or activation code."
                  : verified(p)
                    ? `Reviewed: ${p.verified_at?.slice(0, 10)}`
                    : `Needs review. Last recorded: ${p.verified_at?.slice(0, 10) ?? "unknown"}`}
              </p>
              {safeUrl(p.source_url) && (
                <p>
                  <a
                    href={safeUrl(p.source_url)!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Provider source
                  </a>
                </p>
              )}
              {p.activation_code && (
                <div>
                  <code>{p.activation_code}</code>
                  {verified(p) && (
                    <button
                      className="text-button"
                      onClick={() => copy(p.activation_code!)}
                    >
                      Copy instructions
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
        <p role="status">{message}</p>
      </div>
    </section>
  );
}
