'use client'

import { useState } from 'react'

interface DataPlan {
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

const NETWORKS = ['All', 'MTN', 'Airtel', 'Glo', 'T2 Mobile']

// value_score is GB per ₦1000 (e.g. 6.4 = best, 0.8 = worst)
function ValueBadge({ score }: { score: number | null }) {
  if (score === null) return null
  let label: string
  let bg: string
  let color: string
  if (score >= 4.5) { label = 'Best Value'; bg = '#E8F5EE'; color = '#1B5E3B' }
  else if (score >= 3.0) { label = 'Good Value'; bg = '#FFFBEB'; color = '#78350F' }
  else { label = 'OK'; bg = '#F5F0E8'; color = '#6B6560' }
  return (
    <span style={{
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      color,
      backgroundColor: bg,
      padding: '3px 8px',
      borderRadius: '2px',
      whiteSpace: 'nowrap' as const,
    }}>
      {label}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      style={{
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        fontSize: '12px',
        fontWeight: 600,
        color: copied ? '#6B6560' : '#1B5E3B',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        flexShrink: 0,
      }}
      onClick={() => {
        if (typeof navigator !== 'undefined') {
          navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          })
        }
      }}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function DataPlansClient({
  hiddenDeals,
  allPlans,
}: {
  hiddenDeals: DataPlan[]
  allPlans: DataPlan[]
}) {
  const [activeNetwork, setActiveNetwork] = useState('All')

  const filteredPlans =
    activeNetwork === 'All'
      ? allPlans
      : allPlans.filter((p) => p.network === activeNetwork)

  return (
    <>
      {/* Hidden Deals */}
      {hiddenDeals.length > 0 && (
        <section style={{ padding: '0 24px 80px', backgroundColor: '#0F0F0D' }}>
          <div className="container-content">
            <h2 className="type-h2" style={{ color: '#FFFFFF', marginBottom: '8px' }}>
              Hidden Deals
            </h2>
            <p className="type-body" style={{ color: '#888884', marginBottom: '32px' }}>
              Plans the networks don&apos;t advertise loudly. Verified April 2026.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {hiddenDeals.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    backgroundColor: '#1C1C1A',
                    border: '1px solid #2A2A28',
                    borderRadius: '4px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                      color: '#1B5E3B',
                      backgroundColor: '#E8F5EE',
                      padding: '3px 8px',
                      borderRadius: '2px',
                    }}>
                      {deal.network}
                    </span>
                    <ValueBadge score={deal.value_score} />
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: '1.3',
                  }}>
                    {deal.plan_name}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888884', margin: '0 0 4px' }}>Data</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        {deal.data_gb >= 1 ? `${deal.data_gb}GB` : `${Math.round(deal.data_gb * 1024)}MB`}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888884', margin: '0 0 4px' }}>Price</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        &#8358;{deal.price_naira.toLocaleString()}
                      </p>
                    </div>
                    {deal.validity_days && (
                      <div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888884', margin: '0 0 4px' }}>Validity</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                          {deal.validity_days} {deal.validity_days === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    )}
                    {deal.night_bonus_gb > 0 && (
                      <div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#888884', margin: '0 0 4px' }}>Night Bonus</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: '#1B5E3B', margin: 0 }}>
                          +{deal.night_bonus_gb}GB
                        </p>
                      </div>
                    )}
                  </div>

                  {deal.activation_code && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#0F0F0D',
                      border: '1px solid #333331',
                      borderRadius: '4px',
                      padding: '10px 12px',
                    }}>
                      <code style={{ fontFamily: 'monospace', fontSize: '14px', color: '#FFFFFF', flex: 1 }}>
                        {deal.activation_code}
                      </code>
                      <CopyButton text={deal.activation_code} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Plans with network filter */}
      <section style={{ padding: '0 24px 100px' }}>
        <div className="container-content">
          <h2 className="type-h2" style={{ color: '#1A1A1A', marginBottom: '24px' }}>
            All Data Plans
          </h2>

          {/* Network filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {NETWORKS.map((network) => (
              <button
                key={network}
                onClick={() => setActiveNetwork(network)}
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeNetwork === network ? '2px solid #1B5E3B' : '1px solid #D4CFC8',
                  backgroundColor: activeNetwork === network ? '#E8F5EE' : '#FAFAF7',
                  color: activeNetwork === network ? '#1B5E3B' : '#6B6560',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {network}
              </button>
            ))}
          </div>

          {/* Plans grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {filteredPlans.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '64px 24px',
                border: '1px dashed #D4CFC8',
                borderRadius: '4px',
              }}>
                <p className="type-body" style={{ color: '#6B6560' }}>
                  No plans found for {activeNetwork}.
                </p>
              </div>
            ) : (
              filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="card"
                  style={{ borderRadius: '4px', padding: '24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                      color: '#6B6560',
                      backgroundColor: '#F5F0E8',
                      padding: '3px 8px',
                      borderRadius: '2px',
                    }}>
                      {plan.network}
                    </span>
                    <ValueBadge score={plan.value_score} />
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    margin: '0 0 16px',
                    lineHeight: '1.3',
                  }}>
                    {plan.plan_name}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6560', margin: '0 0 4px' }}>Data</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                        {plan.data_gb >= 1 ? `${plan.data_gb}GB` : `${Math.round(plan.data_gb * 1024)}MB`}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6560', margin: '0 0 4px' }}>Price</p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                        &#8358;{plan.price_naira.toLocaleString()}
                      </p>
                    </div>
                    {plan.validity_days && (
                      <div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6560', margin: '0 0 4px' }}>Validity</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                          {plan.validity_days} {plan.validity_days === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    )}
                    {plan.night_bonus_gb > 0 && (
                      <div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#6B6560', margin: '0 0 4px' }}>Night Bonus</p>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 600, color: '#1B5E3B', margin: 0 }}>
                          +{plan.night_bonus_gb}GB
                        </p>
                      </div>
                    )}
                  </div>

                  {plan.activation_code && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#F5F0E8',
                      border: '1px solid #D4CFC8',
                      borderRadius: '4px',
                      padding: '8px 12px',
                    }}>
                      <code style={{ fontFamily: 'monospace', fontSize: '13px', color: '#1A1A1A', flex: 1 }}>
                        {plan.activation_code}
                      </code>
                      <CopyButton text={plan.activation_code} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
