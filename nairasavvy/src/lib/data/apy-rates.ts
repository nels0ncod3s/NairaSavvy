import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ApyRateRow = Database['public']['Tables']['apy_rates']['Row']

export interface APYRate {
  institution: string
  product_name: string
  product_type: string | null
  apy_percent: number
  min_balance: number
  source_url: string | null
  verified_at: string
  vs_inflation: number
  verdict: 'BEATS INFLATION' | 'CLOSE' | 'LOSING VALUE'
}

function computeVerdict(rate: ApyRateRow, inflationRate: number): APYRate {
  const vs_inflation = rate.apy_percent - inflationRate
  return {
    institution: rate.institution,
    product_name: rate.product_name,
    product_type: rate.product_type,
    apy_percent: rate.apy_percent,
    min_balance: rate.min_balance,
    source_url: rate.source_url,
    verified_at: rate.verified_at,
    vs_inflation,
    verdict: vs_inflation >= 0
      ? 'BEATS INFLATION'
      : vs_inflation >= -5
        ? 'CLOSE'
        : 'LOSING VALUE'
  }
}

export async function getTopAPYRates(inflationRate: number, limit = 10): Promise<APYRate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('apy_rates')
    .select('institution, product_name, product_type, apy_percent, min_balance, source_url, verified_at')
    .eq('is_active', true)
    .not('apy_percent', 'is', null)
    .order('apy_percent', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching APY rates:', error)
    return []
  }

  if (!data) return []

  return (data as ApyRateRow[]).map(rate => computeVerdict(rate, inflationRate))
}

export async function getAllAPYRates(inflationRate: number): Promise<APYRate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('apy_rates')
    .select('institution, product_name, product_type, apy_percent, min_balance, source_url, verified_at')
    .eq('is_active', true)
    .not('apy_percent', 'is', null)
    .order('apy_percent', { ascending: false })

  if (error) {
    console.error('Error fetching all APY rates:', error)
    return []
  }

  if (!data) return []

  return (data as ApyRateRow[]).map(rate => computeVerdict(rate, inflationRate))
}
