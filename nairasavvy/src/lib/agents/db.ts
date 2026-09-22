import "server-only";
import { createClient } from "@supabase/supabase-js";
export function agentDb(publicRead = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicRead
    ? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        }),
    },
  });
}
export function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
