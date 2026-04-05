import { getCurrentInflationRate } from '@/lib/data/inflation'
import { getTopAPYRates, type APYRate } from '@/lib/data/apy-rates'
import Link from 'next/link'

const TYPE_LABELS: Record<string, string> = {
  savings: 'Bank',
  neobank: 'Neobank',
  wealthtech: 'Wealthtech',
}

function VerdictBadge({ verdict }: { verdict: APYRate['verdict'] }) {
  const styles: Record<APYRate['verdict'], { bg: string; text: string; label: string }> = {
    'BEATS INFLATION': {
      bg: '#E8F5EE',
      text: '#1B5E3B',
      label: 'BEATS INFLATION',
    },
    'CLOSE': {
      bg: '#FFFBEB',
      text: '#78350F',
      label: 'CLOSE',
    },
    'LOSING VALUE': {
      bg: '#FEF2F2',
      text: '#7F1D1D',
      label: 'LOSING VALUE',
    },
  }

  const style = styles[verdict]

  return (
    <span
      style={{
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: style.text,
        backgroundColor: style.bg,
        padding: '4px 10px',
        borderRadius: '2px',
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#FAFAF7',
          border: '1px solid #D4CFC8',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#1A1A1A' }}>
            {['Institution', 'Product', 'Type', 'APY', 'Verdict'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '16px 20px',
                  textAlign: h === 'APY' ? 'right' : h === 'Verdict' ? 'center' : 'left',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#FFFFFF',
                borderBottom: '1px solid #D4CFC8',
              }}
            >
              {Array.from({ length: 5 }).map((_, j) => (
                <td key={j} style={{ padding: '16px 20px' }}>
                  <div
                    style={{
                      height: '16px',
                      width: j === 3 ? '60px' : '100px',
                      backgroundColor: '#D4CFC8',
                      borderRadius: '2px',
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ErrorState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        border: '1px dashed #D4CFC8',
        borderRadius: '4px',
        backgroundColor: '#FAFAF7',
      }}
    >
      <p
        className="type-h4"
        style={{ color: '#6B6560', marginBottom: '8px' }}
      >
        Unable to load rates right now.
      </p>
      <p className="type-body" style={{ color: '#9CA3A0' }}>
        Please refresh the page or check back later.
      </p>
    </div>
  )
}

export default async function NairaGuardDashboard() {
  let inflationRate: number | null = null
  let rates: APYRate[] = []
  let hasError = false

  try {
    const inflation = await getCurrentInflationRate()
    inflationRate = inflation?.rate_percent ?? null

    if (inflationRate !== null) {
      rates = await getTopAPYRates(inflationRate, 10)
    }
  } catch (err) {
    console.error('Error loading NairaGuard dashboard:', err)
    hasError = true
  }

  if (hasError || inflationRate === null) {
    return <ErrorState />
  }

  return (
    <>
      <div style={{ marginBottom: '40px' }}>
        <h2
          className="type-h2"
          style={{ color: '#1A1A1A', marginBottom: '8px' }}
        >
          NairaGuard Dashboard
        </h2>
        <p className="type-body" style={{ color: '#6B6560' }}>
          Current savings rates vs. inflation.{' '}
          <strong style={{ color: '#1A1A1A' }}>
            Inflation benchmark: {inflationRate.toFixed(2)}%
          </strong>
        </p>
      </div>

      {/* Inflation Alert Bar */}
      <div
        style={{
          backgroundColor: '#E8F5EE',
          border: '1px solid #1B5E3B',
          borderRadius: '4px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>&#128202;</span>
        <p
          className="type-small"
          style={{ color: '#1B5E3B', margin: 0, lineHeight: '1.5' }}
        >
          <strong>Nigeria's inflation is at {inflationRate.toFixed(2)}%.</strong>{' '}
          Any savings account below this rate is losing real value every month.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#FAFAF7',
            border: '1px solid #D4CFC8',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#1A1A1A' }}>
              <th
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                Institution
              </th>
              <th
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Product
              </th>
              <th
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '16px 20px',
                  textAlign: 'right',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}
              >
                APY
              </th>
              <th
                style={{
                  padding: '16px 20px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    color: '#6B6560',
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  }}
                >
                  No rates data available right now.
                </td>
              </tr>
            ) : (
              rates.map((row, i) => (
                <tr
                  key={`${row.institution}-${row.product_name}`}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#FAFAF7' : '#FFFFFF',
                    borderBottom: '1px solid #D4CFC8',
                  }}
                >
                  <td
                    style={{
                      padding: '16px 20px',
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1A1A1A',
                    }}
                  >
                    {row.institution}
                  </td>
                  <td
                    style={{
                      padding: '16px 20px',
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '15px',
                      color: '#6B6560',
                    }}
                  >
                    {row.product_name}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#6B6560',
                        backgroundColor: '#F5F0E8',
                        padding: '3px 8px',
                        borderRadius: '2px',
                      }}
                    >
                      {TYPE_LABELS[row.product_type ?? ''] ?? row.product_type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '16px 20px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: row.vs_inflation >= 0 ? '#1B5E3B' : '#1A1A1A',
                    }}
                  >
                    {row.apy_percent.toFixed(2)}%
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <VerdictBadge verdict={row.verdict} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p
        className="type-small"
        style={{
          color: '#9CA3A0',
          marginTop: '16px',
        }}
      >
        Rates are for informational purposes only. Always verify current rates
        directly with the institution before making any financial decision.
      </p>

      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Link
          href="/savings"
          style={{
            color: '#1B5E3B',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          View all rates &rarr;
        </Link>
      </div>
    </>
  )
}
