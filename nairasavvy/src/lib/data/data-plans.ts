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

export async function getHiddenDeals(): Promise<DataPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('data_plans')
    .select('id, network, plan_name, data_gb, price_naira, validity_days, night_bonus_gb, activation_code, value_score, is_hidden_deal, source_url')
    .eq('is_hidden_deal', true)
    .eq('is_active', true)
    .order('value_score', { ascending: false })

  if (error) {
    console.error('Error fetching hidden deals:', error)
    return []
  }

  return data || []
}

export async function getTopPlansPerNetwork(): Promise<DataPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('data_plans')
    .select('id, network, plan_name, data_gb, price_naira, validity_days, night_bonus_gb, activation_code, value_score, is_hidden_deal, source_url')
    .eq('is_hidden_deal', false)
    .eq('is_active', true)
    .not('value_score', 'is', null)
    .order('value_score', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Error fetching top plans:', error)
    return []
  }

  return data || []
}

export async function getAllDataPlans(): Promise<DataPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('data_plans')
    .select('id, network, plan_name, data_gb, price_naira, validity_days, night_bonus_gb, activation_code, value_score, is_hidden_deal, source_url')
    .eq('is_active', true)
    .order('value_score', { ascending: false })

  if (error) {
    console.error('Error fetching all data plans:', error)
    return []
  }

  return data || []
}

export async function getDataPlansByNetwork(network: string): Promise<DataPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('data_plans')
    .select('id, network, plan_name, data_gb, price_naira, validity_days, night_bonus_gb, activation_code, value_score, is_hidden_deal, source_url')
    .eq('network', network)
    .eq('is_active', true)
    .order('value_score', { ascending: false })

  if (error) {
    console.error(`Error fetching ${network} plans:`, error)
    return []
  }

  return data || []
}
