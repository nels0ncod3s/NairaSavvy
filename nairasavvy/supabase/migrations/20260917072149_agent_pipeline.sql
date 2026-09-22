-- Apply after src/lib/supabase/schema.sql and upgrade.sql.
BEGIN;
CREATE TABLE public.agent_items (
 fingerprint text PRIMARY KEY CHECK (length(fingerprint)=64),
 item jsonb NOT NULL, collected_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.agent_drafts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 fingerprint text NOT NULL UNIQUE REFERENCES public.agent_items(fingerprint),
 content jsonb NOT NULL, revision text NOT NULL,
 status text NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review','published','rejected')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.agent_briefings (
 id uuid PRIMARY KEY REFERENCES public.agent_drafts(id),
 content jsonb NOT NULL, published_at timestamptz NOT NULL DEFAULT now(),
 reviewer text NOT NULL
);
CREATE TABLE public.agent_editions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject text NOT NULL,
 stories jsonb NOT NULL CHECK (jsonb_array_length(stories) BETWEEN 1 AND 20),
 reviewer text NOT NULL, approved_at timestamptz NOT NULL DEFAULT now(),
 queued_at timestamptz
);
CREATE TABLE public.agent_deliveries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 edition_id uuid NOT NULL REFERENCES public.agent_editions(id),
 subscriber_id uuid REFERENCES public.subscribers(id) ON DELETE SET NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','queued','sent','delivered','suppressed','uncertain','failed')),
 provider_id text UNIQUE, detail text, started_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now(),
 unsubscribe_token text NOT NULL, unsubscribe_hash text NOT NULL UNIQUE,
 UNIQUE(edition_id,subscriber_id)
);
CREATE INDEX agent_delivery_queue ON public.agent_deliveries(status,updated_at);
CREATE INDEX agent_delivery_subscriber ON public.agent_deliveries(subscriber_id);
CREATE TABLE public.agent_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), agent text NOT NULL, source text,
 status text NOT NULL, item_count integer NOT NULL DEFAULT 0,
 detail text, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.agent_items,public.agent_drafts,public.agent_briefings,public.agent_editions,public.agent_deliveries,public.agent_runs FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.agent_items,public.agent_drafts,public.agent_briefings,public.agent_editions,public.agent_deliveries,public.agent_runs TO service_role;
GRANT SELECT(id,content,published_at) ON public.agent_briefings TO anon,authenticated;
CREATE POLICY "Published briefings are public" ON public.agent_briefings FOR SELECT TO anon,authenticated USING (true);

-- Compare-and-swap: approval of an old export cannot approve a newer edit.
CREATE FUNCTION public.agent_publish(draft_id uuid, expected_revision text, reviewer_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE d public.agent_drafts;
BEGIN
 IF length(trim(reviewer_name)) < 2 THEN RAISE EXCEPTION 'Reviewer required'; END IF;
 SELECT * INTO d FROM public.agent_drafts WHERE id=draft_id FOR UPDATE;
 IF NOT FOUND OR d.status <> 'needs_review' OR d.revision <> expected_revision THEN
  RAISE EXCEPTION 'Draft missing, already reviewed, or changed; export and review again';
 END IF;
 INSERT INTO public.agent_briefings(id,content,reviewer) VALUES(d.id,d.content,reviewer_name);
 UPDATE public.agent_drafts SET status='published' WHERE id=d.id;
 RETURN d.id;
END $$;

-- Queue in a transaction and freeze the eligible audience once per edition.
CREATE FUNCTION public.agent_queue(edition uuid)
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE queued timestamptz; count_added integer;
BEGIN
 SELECT queued_at INTO queued FROM public.agent_editions WHERE id=edition FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Approved edition missing'; END IF;
 IF queued IS NOT NULL THEN RETURN 0; END IF;
 INSERT INTO public.agent_deliveries(edition_id,subscriber_id,unsubscribe_token,unsubscribe_hash)
 SELECT edition,s.id, t.token, encode(sha256(convert_to(t.token,'UTF8')),'hex')
 FROM public.subscribers s
 CROSS JOIN LATERAL (SELECT replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','') AS token WHERE s.id IS NOT NULL) t
 WHERE s.active=true AND s.confirmed=true
 ON CONFLICT(edition_id,subscriber_id) DO NOTHING;
 GET DIAGNOSTICS count_added=ROW_COUNT;
 UPDATE public.agent_editions SET queued_at=now() WHERE id=edition;
 RETURN count_added;
END $$;

-- A claimed job is never automatically retried: ambiguous outcomes need reconciliation.
CREATE FUNCTION public.agent_claim()
RETURNS SETOF public.agent_deliveries LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 UPDATE public.agent_deliveries SET status='sending',started_at=now(),updated_at=now()
 WHERE id=(SELECT id FROM public.agent_deliveries WHERE status='pending' ORDER BY updated_at,id FOR UPDATE SKIP LOCKED LIMIT 1)
 RETURNING *;
$$;
CREATE FUNCTION public.agent_unsubscribe(token_hash text)
RETURNS void LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 DELETE FROM public.subscribers WHERE id IN (
  SELECT subscriber_id FROM public.agent_deliveries WHERE unsubscribe_hash=token_hash
 );
$$;
REVOKE ALL ON FUNCTION public.agent_publish(uuid,text,text),public.agent_queue(uuid),public.agent_claim(),public.agent_unsubscribe(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.agent_publish(uuid,text,text),public.agent_queue(uuid),public.agent_claim(),public.agent_unsubscribe(text) TO service_role;

CREATE FUNCTION public.agent_uncurated()
RETURNS SETOF public.agent_items LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$
 SELECT i.* FROM public.agent_items i WHERE NOT EXISTS (SELECT 1 FROM public.agent_drafts d WHERE d.fingerprint=i.fingerprint)
 ORDER BY i.collected_at LIMIT 200;
$$;
REVOKE ALL ON FUNCTION public.agent_uncurated() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.agent_uncurated() TO service_role;
CREATE TABLE public.agent_events (id text PRIMARY KEY, provider_id text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX agent_events_provider ON public.agent_events(provider_id);
ALTER TABLE public.agent_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.agent_events FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.agent_events TO service_role;
CREATE FUNCTION public.agent_suppress(provider text,event_key text)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(provider,0));
 INSERT INTO public.agent_events(id,provider_id) VALUES(event_key,provider) ON CONFLICT DO NOTHING;
 IF NOT FOUND THEN RETURN; END IF;
 UPDATE public.subscribers SET active=false WHERE id IN (SELECT subscriber_id FROM public.agent_deliveries WHERE provider_id=provider);
 UPDATE public.agent_deliveries SET status='suppressed',updated_at=now() WHERE provider_id=provider;
END $$;
REVOKE ALL ON FUNCTION public.agent_suppress(text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.agent_suppress(text,text) TO service_role;


CREATE FUNCTION public.agent_freeze_edition()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 IF NEW.subject IS DISTINCT FROM OLD.subject OR NEW.stories IS DISTINCT FROM OLD.stories OR NEW.reviewer IS DISTINCT FROM OLD.reviewer OR NEW.approved_at IS DISTINCT FROM OLD.approved_at THEN
  RAISE EXCEPTION 'Approved editions are immutable; create a new edition';
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.agent_freeze_edition() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.agent_freeze_edition() TO service_role;
CREATE TRIGGER agent_edition_frozen BEFORE UPDATE ON public.agent_editions FOR EACH ROW EXECUTE FUNCTION public.agent_freeze_edition();

-- A provider webhook can arrive before Sendy's acceptance response is saved.
CREATE FUNCTION public.agent_apply_early_suppression()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 IF NEW.provider_id IS NOT NULL THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.provider_id,0));
 END IF;
 IF NEW.provider_id IS NOT NULL AND EXISTS(SELECT 1 FROM public.agent_events WHERE provider_id=NEW.provider_id) THEN
  NEW.status='suppressed';
  UPDATE public.subscribers SET active=false WHERE id=NEW.subscriber_id;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.agent_apply_early_suppression() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.agent_apply_early_suppression() TO service_role;
CREATE TRIGGER agent_early_suppression BEFORE UPDATE OF provider_id ON public.agent_deliveries FOR EACH ROW EXECUTE FUNCTION public.agent_apply_early_suppression();
COMMIT;
