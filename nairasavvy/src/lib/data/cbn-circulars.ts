import { createClient } from '@/lib/supabase/server'

export interface CBNCircular {
  id: string
  reference_number: string | null
  title: string
  date_issued: string
  category: string | null
  summary: string | null
  source_url: string | null
  article_potential: boolean
}

export async function getConsumerCirculars(): Promise<CBNCircular[]> {
  const supabase = await createClient()
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('cbn_circulars')
    .select('id, reference_number, title, date_issued, category, summary, source_url, article_potential')
    .eq('affects_consumers', true)
    .gte('date_issued', sixMonthsAgo)
    .order('date_issued', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching CBN circulars:', error)
    return []
  }

  return data || []
}
