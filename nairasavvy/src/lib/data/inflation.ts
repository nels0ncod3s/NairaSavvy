import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type InflationRow = Database['public']['Tables']['inflation_data']['Row']

export async function getCurrentInflationRate(): Promise<InflationRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inflation_data')
    .select('rate_percent, period, source, recorded_at')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching inflation rate:', error)
    return null
  }

  return data
}
