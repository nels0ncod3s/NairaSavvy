import { createClient } from '@/lib/supabase/server'

export interface DataPlan {
  id: string
  network: string
  plan_name: string
  data_gb: number
  price_naira: number
  validity_days: number | null
  night_bonus_gb: number
  activation_code: string | null
  value_score: number | null
  is_hidden_deal: boolean
  source_url: string | null
}

// ── Static fallback data (shown when Supabase is not configured / table empty) ──
// Source: NairaSavvy research, April 2026
const STATIC_DATA_PLANS: DataPlan[] = [
  // MTN
  { id: 'mtn-1',  network: 'MTN',      plan_name: '40MB Daily',              data_gb: 0.04,  price_naira: 50,    validity_days: 1,  night_bonus_gb: 0,   activation_code: 'Text 114 to 131',        value_score: 0.8,  is_hidden_deal: false, source_url: null },
  { id: 'mtn-2',  network: 'MTN',      plan_name: '100MB Daily',             data_gb: 0.10,  price_naira: 100,   validity_days: 1,  night_bonus_gb: 0,   activation_code: 'Text 104 to 131',        value_score: 1.0,  is_hidden_deal: false, source_url: null },
  { id: 'mtn-3',  network: 'MTN',      plan_name: '1GB Daily',               data_gb: 1.0,   price_naira: 300,   validity_days: 1,  night_bonus_gb: 0,   activation_code: 'Text 155 to 131 or *312#', value_score: 3.33, is_hidden_deal: false, source_url: null },
  { id: 'mtn-4',  network: 'MTN',      plan_name: '2GB 2-Day',               data_gb: 2.0,   price_naira: 500,   validity_days: 2,  night_bonus_gb: 0,   activation_code: 'Text 154 to 131',        value_score: 4.0,  is_hidden_deal: false, source_url: null },
  { id: 'mtn-5',  network: 'MTN',      plan_name: '1.5GB Monthly',           data_gb: 1.5,   price_naira: 1000,  validity_days: 30, night_bonus_gb: 0,   activation_code: 'Text 106 to 131',        value_score: 1.5,  is_hidden_deal: false, source_url: null },
  { id: 'mtn-6',  network: 'MTN',      plan_name: '2GB + 4GB YouTube Night', data_gb: 2.0,   price_naira: 1200,  validity_days: 30, night_bonus_gb: 4.0, activation_code: 'Text 130 to 131',        value_score: 5.0,  is_hidden_deal: true,  source_url: null },
  { id: 'mtn-7',  network: 'MTN',      plan_name: '3GB + 4GB YouTube Night', data_gb: 3.0,   price_naira: 1500,  validity_days: 30, night_bonus_gb: 4.0, activation_code: '*312#',                  value_score: 4.67, is_hidden_deal: true,  source_url: null },
  { id: 'mtn-8',  network: 'MTN',      plan_name: '2.7GB Monthly',           data_gb: 2.7,   price_naira: 2000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.35, is_hidden_deal: false, source_url: null },
  { id: 'mtn-9',  network: 'MTN',      plan_name: '7GB Monthly',             data_gb: 7.0,   price_naira: 3500,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.0,  is_hidden_deal: false, source_url: null },
  { id: 'mtn-10', network: 'MTN',      plan_name: '10GB Monthly',            data_gb: 10.0,  price_naira: 4500,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.22, is_hidden_deal: false, source_url: null },
  { id: 'mtn-11', network: 'MTN',      plan_name: '12.5GB Monthly',          data_gb: 12.5,  price_naira: 5500,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.27, is_hidden_deal: false, source_url: null },
  { id: 'mtn-12', network: 'MTN',      plan_name: '16.5GB Monthly',          data_gb: 16.5,  price_naira: 6500,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.54, is_hidden_deal: false, source_url: null },
  // Airtel
  { id: 'air-1',  network: 'Airtel',   plan_name: '40MB Daily',              data_gb: 0.04,  price_naira: 50,    validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 0.8,  is_hidden_deal: false, source_url: null },
  { id: 'air-2',  network: 'Airtel',   plan_name: '100MB Daily',             data_gb: 0.10,  price_naira: 100,   validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.0,  is_hidden_deal: false, source_url: null },
  { id: 'air-3',  network: 'Airtel',   plan_name: '200MB 3-Day',             data_gb: 0.20,  price_naira: 200,   validity_days: 3,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.0,  is_hidden_deal: false, source_url: null },
  { id: 'air-4',  network: 'Airtel',   plan_name: '1GB Daily',               data_gb: 1.0,   price_naira: 350,   validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.86, is_hidden_deal: false, source_url: null },
  { id: 'air-5',  network: 'Airtel',   plan_name: '750MB + 1GB Night Weekly',data_gb: 0.75,  price_naira: 500,   validity_days: 7,  night_bonus_gb: 1.0, activation_code: '*312#',                  value_score: 3.5,  is_hidden_deal: true,  source_url: null },
  { id: 'air-6',  network: 'Airtel',   plan_name: '5GB + 2GB YouTube Weekly',data_gb: 5.0,   price_naira: 1500,  validity_days: 7,  night_bonus_gb: 2.0, activation_code: '*312#',                  value_score: 4.67, is_hidden_deal: true,  source_url: null },
  { id: 'air-7',  network: 'Airtel',   plan_name: '2GB Monthly',             data_gb: 2.0,   price_naira: 1500,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.33, is_hidden_deal: false, source_url: null },
  { id: 'air-8',  network: 'Airtel',   plan_name: '3GB Monthly',             data_gb: 3.0,   price_naira: 2000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.5,  is_hidden_deal: false, source_url: null },
  { id: 'air-9',  network: 'Airtel',   plan_name: '8GB Monthly',             data_gb: 8.0,   price_naira: 3000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.67, is_hidden_deal: false, source_url: null },
  { id: 'air-10', network: 'Airtel',   plan_name: '10GB Monthly',            data_gb: 10.0,  price_naira: 4000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 2.5,  is_hidden_deal: false, source_url: null },
  { id: 'air-11', network: 'Airtel',   plan_name: '25GB Monthly',            data_gb: 25.0,  price_naira: 8000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 3.13, is_hidden_deal: false, source_url: null },
  { id: 'air-12', network: 'Airtel',   plan_name: '40GB Monthly',            data_gb: 40.0,  price_naira: 10000, validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 4.0,  is_hidden_deal: false, source_url: null },
  // Glo
  { id: 'glo-1',  network: 'Glo',      plan_name: '45MB Daily',              data_gb: 0.045, price_naira: 50,    validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 0.9,  is_hidden_deal: false, source_url: null },
  { id: 'glo-2',  network: 'Glo',      plan_name: '1GB Daily',               data_gb: 1.0,   price_naira: 300,   validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 3.33, is_hidden_deal: false, source_url: null },
  { id: 'glo-3',  network: 'Glo',      plan_name: '2GB 2-Day',               data_gb: 2.0,   price_naira: 500,   validity_days: 2,  night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 4.0,  is_hidden_deal: false, source_url: null },
  { id: 'glo-4',  network: 'Glo',      plan_name: '1.8GB 14-Day',            data_gb: 1.8,   price_naira: 500,   validity_days: 14, night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 3.6,  is_hidden_deal: false, source_url: null },
  { id: 'glo-5',  network: 'Glo',      plan_name: '7GB Weekly',              data_gb: 7.0,   price_naira: 1500,  validity_days: 7,  night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 4.67, is_hidden_deal: false, source_url: null },
  { id: 'glo-6',  network: 'Glo',      plan_name: '2.6GB + 2GB Night',       data_gb: 2.6,   price_naira: 1000,  validity_days: 30, night_bonus_gb: 2.0, activation_code: '*312# or *777#',         value_score: 4.6,  is_hidden_deal: true,  source_url: null },
  { id: 'glo-7',  network: 'Glo',      plan_name: '32GB Monthly',            data_gb: 32.0,  price_naira: 5000,  validity_days: 30, night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 6.4,  is_hidden_deal: false, source_url: null },
  { id: 'glo-8',  network: 'Glo',      plan_name: '42GB Monthly',            data_gb: 42.0,  price_naira: 10000, validity_days: 30, night_bonus_gb: 0,   activation_code: '*312# or *777#',         value_score: 4.2,  is_hidden_deal: false, source_url: null },
  // T2 Mobile (formerly 9mobile)
  { id: 't2-1',   network: 'T2 Mobile', plan_name: '40MB Daily',             data_gb: 0.04,  price_naira: 50,    validity_days: 1,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 0.8,  is_hidden_deal: false, source_url: null },
  { id: 't2-2',   network: 'T2 Mobile', plan_name: 'Social/Chat/Video Pak',  data_gb: 0.5,   price_naira: 400,   validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 1.25, is_hidden_deal: false, source_url: null },
  { id: 't2-3',   network: 'T2 Mobile', plan_name: '7GB Weekly',             data_gb: 7.0,   price_naira: 1500,  validity_days: 7,  night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 4.67, is_hidden_deal: false, source_url: null },
  { id: 't2-4',   network: 'T2 Mobile', plan_name: '50GB Monthly',           data_gb: 50.0,  price_naira: 10000, validity_days: 30, night_bonus_gb: 0,   activation_code: '*312#',                  value_score: 5.0,  is_hidden_deal: false, source_url: null },
]

async function fetchFromSupabase(): Promise<DataPlan[] | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('data_plans')
      .select('id, network, plan_name, data_gb, price_naira, validity_days, night_bonus_gb, activation_code, value_score, is_hidden_deal, source_url')
      .eq('is_active', true)
      .order('value_score', { ascending: false })
    if (error || !data || data.length === 0) return null
    return data as DataPlan[]
  } catch {
    return null
  }
}

export async function getHiddenDeals(): Promise<DataPlan[]> {
  const live = await fetchFromSupabase()
  const all = live ?? STATIC_DATA_PLANS
  return all
    .filter(p => p.is_hidden_deal)
    .sort((a, b) => (b.value_score ?? 0) - (a.value_score ?? 0))
}

export async function getTopPlansPerNetwork(): Promise<DataPlan[]> {
  const live = await fetchFromSupabase()
  const all = live ?? STATIC_DATA_PLANS
  return all
    .filter(p => !p.is_hidden_deal && p.value_score !== null)
    .sort((a, b) => (b.value_score ?? 0) - (a.value_score ?? 0))
    .slice(0, 12)
}

export async function getAllDataPlans(): Promise<DataPlan[]> {
  const live = await fetchFromSupabase()
  return live ?? STATIC_DATA_PLANS.sort((a, b) => (b.value_score ?? 0) - (a.value_score ?? 0))
}

export async function getDataPlansByNetwork(network: string): Promise<DataPlan[]> {
  const live = await fetchFromSupabase()
  const all = live ?? STATIC_DATA_PLANS
  return all
    .filter(p => p.network === network)
    .sort((a, b) => (b.value_score ?? 0) - (a.value_score ?? 0))
}
