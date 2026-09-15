import { createClient } from "@/lib/supabase/server";
import { isFresh, realReturn, safeUrl } from "@/lib/finance";
import type { ApyRate } from "@/lib/supabase/types";
export type APYRate = ApyRate & {
  vs_inflation: number | null;
  real_return: number | null;
  verdict: string;
};
export function computeVerdict(
  rate: ApyRate,
  inflation: number | null,
): APYRate {
  const comparable =
    rate.currency === "NGN" &&
    inflation !== null &&
    safeUrl(rate.source_url) &&
    isFresh(rate.verified_at, 30);
  const value = comparable ? realReturn(rate.apy_percent, inflation!) : null;
  return {
    ...rate,
    real_return: value,
    vs_inflation: comparable ? rate.apy_percent - inflation! : null,
    verdict:
      value === null
        ? "NOT COMPARED"
        : value > 0
          ? "ABOVE INFLATION"
          : value === 0
            ? "MATCHES INFLATION"
            : "BELOW INFLATION",
  };
}
export async function getAllAPYRates(
  inflation: number | null,
): Promise<APYRate[]> {
  try {
    const client = await createClient();
    if (!client) return [];
    const { data, error } = await client
      .from("apy_rates")
      .select("*")
      .eq("is_active", true)
      .order("apy_percent", { ascending: false });
    if (error) return [];
    return (data ?? [])
      .filter((r) => Number.isFinite(r.apy_percent) && r.apy_percent >= 0)
      .map((r) => computeVerdict(r, inflation));
  } catch {
    return [];
  }
}
export async function getTopAPYRates(inflation: number | null, limit = 10) {
  return (await getAllAPYRates(inflation)).slice(0, limit);
}
