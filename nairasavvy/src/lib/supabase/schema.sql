-- NairaSavvy — Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Articles (mirrors MDX content, used for dynamic fetching and counts)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  read_time INT,
  featured BOOLEAN DEFAULT false,
  keywords TEXT[],
  view_count INT DEFAULT 0
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true
);

-- APY rates (for Naira-Guard dashboard)
CREATE TABLE IF NOT EXISTS apy_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT,
  apy_percent DECIMAL(5,2) NOT NULL,
  min_balance BIGINT DEFAULT 0,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  source_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Inflation reference
CREATE TABLE IF NOT EXISTS inflation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_percent DECIMAL(5,2) NOT NULL,
  period TEXT NOT NULL,
  source TEXT DEFAULT 'NBS',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content pipeline queue
CREATE TABLE IF NOT EXISTS content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  brief JSONB,
  full_article TEXT,
  status TEXT DEFAULT 'pending',
  quality_score INT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- CBN Circulars (policy updates that affect consumers)
CREATE TABLE IF NOT EXISTS cbn_circulars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT,
  title TEXT NOT NULL,
  date_issued DATE NOT NULL,
  category TEXT,
  summary TEXT,
  source_url TEXT,
  article_potential BOOLEAN DEFAULT false,
  affects_consumers BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Plans (mobile data comparison)
CREATE TABLE IF NOT EXISTS data_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  data_gb DECIMAL(6,2) NOT NULL,
  price_naira INT NOT NULL,
  validity_days INT,
  night_bonus_gb DECIMAL(6,2) DEFAULT 0,
  activation_code TEXT,
  value_score DECIMAL(6,2),
  is_hidden_deal BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sourced, reviewed data separately. No example financial rates are seeded.

-- ─── Row Level Security ───────────────────────────────────────────────

-- Enable RLS
ALTER TABLE articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE apy_rates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inflation_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_queue   ENABLE ROW LEVEL SECURITY;

-- Public read access for articles, apy_rates, inflation_data
DROP POLICY IF EXISTS "Public can read articles" ON articles;
CREATE POLICY "Public can read articles" ON articles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read apy_rates" ON apy_rates;
CREATE POLICY "Public can read apy_rates" ON apy_rates
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read inflation_data" ON inflation_data;
CREATE POLICY "Public can read inflation_data" ON inflation_data
  FOR SELECT USING (true);

-- Subscribers: insert only (no public read)
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
-- Signups are handled only by the server-side subscription API.
REVOKE ALL ON subscribers FROM anon, authenticated;

-- Content queue: service role only
-- (No public access — manage via service role key in API routes)

-- CBN circulars: public read
ALTER TABLE cbn_circulars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read cbn_circulars" ON cbn_circulars;
CREATE POLICY "Public can read cbn_circulars" ON cbn_circulars
  FOR SELECT USING (true);

-- Data plans: public read
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read data_plans" ON data_plans;
CREATE POLICY "Public can read data_plans" ON data_plans
  FOR SELECT USING (is_active = true);

GRANT SELECT ON articles, apy_rates, inflation_data, cbn_circulars, data_plans TO anon, authenticated;
-- Next apply upgrade.sql for comparison metadata and newsletter lifecycle fields.
