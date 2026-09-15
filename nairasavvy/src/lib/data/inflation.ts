import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isFresh, safeUrl } from "@/lib/finance";
export const getCurrentInflationRate = cache(async () => {
  try {
    const client = await createClient();
    if (!client) return null;
    const { data, error } = await client
      .from("inflation_data")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (
      error ||
      !data ||
      !safeUrl(data.source_url) ||
      !isFresh(data.recorded_at, 60) ||
      !Number.isFinite(data.rate_percent) ||
      data.rate_percent < 0
    )
      return null;
    return data;
  } catch {
    return null;
  }
});
