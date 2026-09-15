-- Apply after schema.sql for an existing NairaSavvy database. Safe to repeat.
BEGIN;
-- Abort rather than silently merging subscribers with different consent history.
DO $$ BEGIN
  IF EXISTS (SELECT lower(trim(email)) FROM public.subscribers GROUP BY lower(trim(email)) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Resolve case-insensitive duplicate subscribers before applying upgrade.sql';
  END IF;
END $$;
UPDATE public.subscribers SET email=lower(trim(email)) WHERE email <> lower(trim(email));
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_normalized ON public.subscribers(lower(email));
ALTER TABLE public.apy_rates ADD COLUMN IF NOT EXISTS currency text;
ALTER TABLE public.apy_rates ADD COLUMN IF NOT EXISTS rate_type text;
ALTER TABLE public.apy_rates ADD COLUMN IF NOT EXISTS access_terms text;
ALTER TABLE public.apy_rates ADD COLUMN IF NOT EXISTS fees text;
ALTER TABLE public.apy_rates ADD COLUMN IF NOT EXISTS risk_notes text;
ALTER TABLE public.inflation_data ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE public.data_plans ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE public.data_plans ADD COLUMN IF NOT EXISTS bonus_restrictions text;
ALTER TABLE public.data_plans ADD COLUMN IF NOT EXISTS eligibility text;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS confirmation_hash text;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS confirmation_expires_at timestamptz;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS unsubscribe_hash text;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS last_confirmation_at timestamptz;
ALTER TABLE public.subscribers ALTER COLUMN active SET DEFAULT false;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
REVOKE ALL ON public.subscribers FROM anon, authenticated;
GRANT ALL ON public.subscribers TO service_role;
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_confirmation_hash ON public.subscribers(confirmation_hash) WHERE confirmation_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_unsubscribe_hash ON public.subscribers(unsubscribe_hash) WHERE unsubscribe_hash IS NOT NULL;
CREATE TABLE IF NOT EXISTS public.newsletter_request_limits (
  bucket text PRIMARY KEY, started_at timestamptz NOT NULL, request_count integer NOT NULL
);
CREATE INDEX IF NOT EXISTS newsletter_limits_expiry ON public.newsletter_request_limits(started_at);
ALTER TABLE public.newsletter_request_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.newsletter_request_limits FROM anon, authenticated;
GRANT ALL ON public.newsletter_request_limits TO service_role;
CREATE OR REPLACE FUNCTION public.newsletter_allow_request(bucket_key text, window_seconds integer, max_requests integer)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE current_count integer;
BEGIN
  IF window_seconds < 1 OR max_requests < 1 THEN RETURN false; END IF;
  DELETE FROM public.newsletter_request_limits WHERE started_at < now() - interval '2 days';
  INSERT INTO public.newsletter_request_limits AS limits (bucket,started_at,request_count)
  VALUES (bucket_key, now(), 1)
  ON CONFLICT(bucket) DO UPDATE SET
    request_count = CASE WHEN limits.started_at <= now()-make_interval(secs=>window_seconds) THEN 1 ELSE limits.request_count+1 END,
    started_at = CASE WHEN limits.started_at <= now()-make_interval(secs=>window_seconds) THEN now() ELSE limits.started_at END
  RETURNING request_count INTO current_count;
  RETURN current_count <= max_requests;
END $$;
REVOKE ALL ON FUNCTION public.newsletter_allow_request(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_allow_request(text,integer,integer) TO service_role;
-- Do not backfill currency, verification dates or source URLs with guesses.

COMMIT;
