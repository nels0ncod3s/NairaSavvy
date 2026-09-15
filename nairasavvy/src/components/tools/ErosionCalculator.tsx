"use client";
import { useId, useState } from "react";
import { erosion } from "@/lib/finance";
export default function ErosionCalculator({
  initialInflationRate,
  inflationPeriod,
  inflationSource,
}: {
  initialInflationRate?: number;
  inflationPeriod?: string;
  inflationSource?: string;
}) {
  const id = useId();
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState(initialInflationRate?.toString() ?? "20");
  const [years, setYears] = useState("1");
  const result = [amount, rate, years].some((v) => !v.trim())
    ? null
    : erosion(Number(amount), Number(rate), Number(years));
  const money = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  return (
    <div className="erosion-calc-wrap tool-panel">
      <h3 className="type-h3">Inflation Erosion Calculator</h3>
      <p>
        Explore purchasing power assuming a constant annual inflation rate and
        no interest earned.
      </p>
      <p className="type-small">
        {initialInflationRate !== undefined
          ? `Reference: ${initialInflationRate}% — ${inflationPeriod} (${inflationSource}).`
          : "Illustrative rate: 20%. A verified current reference is unavailable. Change the rate to explore a scenario."}
      </p>
      <div className="form-grid">
        <label htmlFor={`${id}-amount`}>
          Amount (₦)
          <input
            id={`${id}-amount`}
            className="input"
            type="number"
            min="0"
            max="1000000000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label htmlFor={`${id}-rate`}>
          Annual inflation (%)
          <input
            id={`${id}-rate`}
            className="input"
            type="number"
            min="0"
            max="200"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <label htmlFor={`${id}-years`}>
          Years
          <input
            id={`${id}-years`}
            className="input"
            type="number"
            min="0"
            max="50"
            step="0.5"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>
      </div>
      {initialInflationRate !== undefined && (
        <button
          className="text-button"
          onClick={() => setRate(String(initialInflationRate))}
        >
          Reset to reference rate
        </button>
      )}
      <div aria-live="polite" aria-atomic="true">
        {!result ? (
          <p role="alert">
            Enter an amount from ₦0 to ₦1 trillion, inflation from 0–200%, and a
            timeframe from 0–50 years.
          </p>
        ) : (
          <div className="form-grid calculator-results">
            {[
              [
                "Future cost",
                result.futureCost,
                "Cost of the same basket of goods in the future.",
              ],
              [
                "Purchasing power lost",
                result.loss,
                "Loss measured in today’s naira.",
              ],
              [
                "Remaining purchasing power",
                result.purchasingPower,
                "What the unchanged balance can buy in today’s naira.",
              ],
            ].map(([label, value, description]) => (
              <div key={String(label)} className="result-card">
                <p>{label}</p>
                <strong className="result-number">
                  {money(Number(value))}
                </strong>
                <p className="type-small">{description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="type-small">
        Purchasing power = amount ÷ (1 + inflation rate)<sup>years</sup>. This
        is a scenario, not a forecast. Your own spending mix may differ from the
        national basket.
      </p>
    </div>
  );
}
