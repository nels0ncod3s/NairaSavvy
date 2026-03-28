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

-- ─── Seed Data ────────────────────────────────────────────────────────

-- Current inflation rate (NBS, March 2026)
INSERT INTO inflation_data (rate_percent, period, source)
VALUES (32.70, 'March 2026', 'NBS')
ON CONFLICT DO NOTHING;

-- APY rates seed data
INSERT INTO apy_rates (institution, product_name, product_type, apy_percent, is_active)
VALUES
  ('PiggyVest',   'Flex Dollar',       'wealthtech', 7.00,  true),
  ('Cowrywise',   'Dollar Fund',       'wealthtech', 6.50,  true),
  ('Lotus Bank',  'Fixed Deposit',     'savings',    22.00, true),
  ('Kuda Bank',   'High Yield Save',   'neobank',    15.00, true),
  ('GTBank',      'Smart Save',        'savings',    8.50,  true),
  ('Zenith Bank', 'Target Save',       'savings',    6.00,  true),
  ('Access Bank', 'PayDay Save',       'savings',    8.00,  true),
  ('OPay',        'Savings',           'neobank',    15.00, true),
  ('PiggyVest',   'SafeLock',          'wealthtech', 13.00, true),
  ('Moniepoint',  'Business Save',     'neobank',    14.00, true)
ON CONFLICT DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────

-- Enable RLS
ALTER TABLE articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE apy_rates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inflation_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_queue   ENABLE ROW LEVEL SECURITY;

-- Public read access for articles, apy_rates, inflation_data
CREATE POLICY "Public can read articles" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Public can read apy_rates" ON apy_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read inflation_data" ON inflation_data
  FOR SELECT USING (true);

-- Subscribers: insert only (no public read)
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Content queue: service role only
-- (No public access — manage via service role key in API routes)
