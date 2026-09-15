import { getCurrentInflationRate } from "@/lib/data/inflation";
import { getAllAPYRates } from "@/lib/data/apy-rates";
import { isFresh, safeUrl } from "@/lib/finance";
export default async function NairaGuardDashboard() {
  const inflation = await getCurrentInflationRate();
  const rates = await getAllAPYRates(inflation?.rate_percent ?? null);
  const groups = ["NGN", "USD", "Unspecified"];
  return (
    <div>
      <h2 className="type-h2">NairaGuard savings comparison</h2>
      <p>
        {inflation
          ? `Inflation reference: ${inflation.rate_percent}% (${inflation.period}, ${inflation.source}).`
          : "A verified recent inflation reference is unavailable. Inflation verdicts are paused."}{" "}
        {inflation?.source_url && (
          <a
            href={safeUrl(inflation.source_url) ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
        )}
      </p>
      <p className="type-small">
        Compare within one currency. Quoted annual yields are before any
        unspecified fees or taxes. USD products are not compared with Nigerian
        inflation; exchange-rate changes affect their naira value.
      </p>
      {!rates.length && (
        <div className="tool-panel">
          <p>
            Rates are unavailable right now. Please check again later. You can
            still use the calculator and guides below.
          </p>
        </div>
      )}
      {groups.map((currency) => {
        const rows = rates.filter(
          (r) =>
            (r.currency === "NGN" || r.currency === "USD"
              ? r.currency
              : "Unspecified") === currency,
        );
        return (
          rows.length > 0 && (
            <section key={currency} className="rate-group">
              <h3>
                {currency === "Unspecified"
                  ? "Currency awaiting verification"
                  : `${currency} products`}
              </h3>
              <div
                className="table-scroll"
                tabIndex={0}
                role="region"
                aria-label={`${currency} savings products`}
              >
                <table className="comparison-table">
                  <caption>Product terms and verification status</caption>
                  <thead>
                    <tr>
                      {[
                        "Product",
                        "Annual yield",
                        "Terms",
                        "Inflation comparison",
                        "Source",
                      ].map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <th scope="row">
                          {r.institution}
                          <br />
                          <span className="type-small">{r.product_name}</span>
                        </th>
                        <td>
                          {r.apy_percent.toFixed(2)}%<br />
                          {r.rate_type ?? "Rate basis not supplied"}
                        </td>
                        <td>
                          Minimum:{" "}
                          {r.currency
                            ? `${r.currency} ${r.min_balance.toLocaleString("en-NG")}`
                            : "Currency unverified"}
                          <br />
                          Access: {r.access_terms ?? "Not supplied"}
                          <br />
                          Fees: {r.fees ?? "Not supplied"}
                          <br />
                          Risk:{" "}
                          {r.risk_notes ??
                            "Not assessed — check provider terms"}
                        </td>
                        <td>
                          {r.verdict}
                          {r.real_return !== null && (
                            <>
                              <br />
                              {r.real_return.toFixed(2)}% estimated annual real
                              return
                            </>
                          )}
                        </td>
                        <td>
                          {safeUrl(r.source_url) ? (
                            <a
                              href={safeUrl(r.source_url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Provider source
                            </a>
                          ) : (
                            "Source missing"
                          )}
                          <br />
                          {r.verified_at
                            ? `Recorded: ${r.verified_at.slice(0, 10)}`
                            : "Not verified"}
                          <br />
                          {!safeUrl(r.source_url) || !isFresh(r.verified_at, 30)
                            ? "Needs review"
                            : "Reviewed within 30 days"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        );
      })}
      <p className="type-small">
        Real return = (1 + annual yield) ÷ (1 + annual inflation) − 1. The
        calculation assumes both rates stay constant. A higher yield does not
        imply a safer or more suitable product.
      </p>
    </div>
  );
}
