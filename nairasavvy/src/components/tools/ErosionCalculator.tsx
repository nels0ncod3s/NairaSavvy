'use client'

import { useState, useEffect } from 'react'

interface ErosionCalculatorProps {
  initialInflationRate?: number
  inflationPeriod?: string
  inflationSource?: string
}

export default function ErosionCalculator({
  initialInflationRate,
  inflationPeriod,
  inflationSource,
}: ErosionCalculatorProps) {
  const [amount, setAmount] = useState('100000')
  const [inflationRate, setInflationRate] = useState(
    initialInflationRate?.toString() ?? '15.06'
  )
  const [years, setYears] = useState('1')

  const numericAmount = parseFloat(amount) || 0
  const numericRate = parseFloat(inflationRate) || 0
  const numericYears = parseFloat(years) || 0

  const futureValue = numericAmount * Math.pow(1 + numericRate / 100, numericYears)
  const loss = futureValue - numericAmount
  const purchasingPower = numericAmount / Math.pow(1 + numericRate / 100, numericYears)

  const handleResetToCurrent = () => {
    if (initialInflationRate) {
      setInflationRate(initialInflationRate.toString())
    }
  }

  return (
    <div
      className="erosion-calc-wrap"
      style={{
        backgroundColor: '#FAFAF7',
        border: '1px solid #D4CFC8',
        borderRadius: '4px',
      }}
    >
      <h3
        className="type-h3"
        style={{ color: '#1A1A1A', marginBottom: '8px' }}
      >
        Inflation Erosion Calculator
      </h3>
      <p className="type-body" style={{ color: '#6B6560', marginBottom: '24px' }}>
        See how much your money loses to inflation over time.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        <div>
          <label
            className="type-label"
            style={{ display: 'block', marginBottom: '8px', color: '#6B6560' }}
          >
            Amount (Naira)
          </label>
          <input
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100000"
          />
        </div>

        <div>
          <label
            className="type-label"
            style={{ display: 'block', marginBottom: '8px', color: '#6B6560' }}
          >
            Inflation Rate (%)
          </label>
          <input
            type="number"
            className="input"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            step="0.01"
            placeholder="15.06"
          />
          {inflationPeriod && (
            <p
              className="type-small"
              style={{ color: '#9CA3A0', marginTop: '4px' }}
            >
              Current: {inflationRate}% ({inflationPeriod}
              {inflationSource ? `, ${inflationSource}` : ''})
            </p>
          )}
          {initialInflationRate && inflationRate !== initialInflationRate.toString() && (
            <button
              onClick={handleResetToCurrent}
              style={{
                marginTop: '8px',
                background: 'none',
                border: 'none',
                color: '#1B5E3B',
                fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Reset to current rate
            </button>
          )}
        </div>

        <div>
          <label
            className="type-label"
            style={{ display: 'block', marginBottom: '8px', color: '#6B6560' }}
          >
            Years
          </label>
          <input
            type="number"
            className="input"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="0.5"
            step="0.5"
            placeholder="1"
          />
        </div>
      </div>

      {/* Results */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #7F1D1D',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p
            className="type-label"
            style={{ color: '#7F1D1D', marginBottom: '8px' }}
          >
            Future Cost
          </p>
          <p
            className="result-number"
            style={{
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              fontWeight: 700,
              color: '#7F1D1D',
              margin: 0,
            }}
          >
            &#8358;{futureValue.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
          <p
            className="type-small"
            style={{ color: '#7F1D1D', margin: '4px 0 0' }}
          >
            What your &#8358;{numericAmount.toLocaleString()} will need to buy
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #78350F',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p
            className="type-label"
            style={{ color: '#78350F', marginBottom: '8px' }}
          >
            Value Lost
          </p>
          <p
            className="result-number"
            style={{
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              fontWeight: 700,
              color: '#78350F',
              margin: 0,
            }}
          >
            &#8358;{loss.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
          <p
            className="type-small"
            style={{ color: '#78350F', margin: '4px 0 0' }}
          >
            Purchasing power erased
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#E8F5EE',
            border: '1px solid #1B5E3B',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p
            className="type-label"
            style={{ color: '#1B5E3B', marginBottom: '8px' }}
          >
            Remaining Power
          </p>
          <p
            className="result-number"
            style={{
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              fontWeight: 700,
              color: '#1B5E3B',
              margin: 0,
            }}
          >
            &#8358;{purchasingPower.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
          </p>
          <p
            className="type-small"
            style={{ color: '#1B5E3B', margin: '4px 0 0' }}
          >
            What your money is really worth
          </p>
        </div>
      </div>
    </div>
  )
}
