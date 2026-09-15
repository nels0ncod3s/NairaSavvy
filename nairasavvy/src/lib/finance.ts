export function erosion(amount: number, inflation: number, years: number) {
  if (
    ![amount, inflation, years].every(Number.isFinite) ||
    amount < 0 ||
    amount > 1e12 ||
    inflation < 0 ||
    inflation > 200 ||
    years < 0 ||
    years > 50
  )
    return null;
  const factor = (1 + inflation / 100) ** years;
  const purchasingPower = amount / factor;
  return {
    futureCost: amount * factor,
    purchasingPower,
    loss: amount - purchasingPower,
  };
}
export function realReturn(apy: number, inflation: number) {
  return ((1 + apy / 100) / (1 + inflation / 100) - 1) * 100;
}
export function isFresh(
  date: string | null | undefined,
  days: number,
  now = Date.now(),
) {
  const timestamp = Date.parse(date ?? "");
  return (
    Number.isFinite(timestamp) &&
    timestamp <= now &&
    now - timestamp <= days * 86400000
  );
}
export function safeUrl(value: string | null | undefined): string | null {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
