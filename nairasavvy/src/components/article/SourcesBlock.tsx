"use client";

interface Source {
  name: string
  year: string | number
  url: string
  description?: string
}

interface SourcesBlockProps {
  sources: Source[]
}

export function SourcesBlock({ sources }: SourcesBlockProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div
      style={{
        marginTop: '72px',
        paddingTop: '32px',
        borderTop: '2px solid #1A1A1A',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#6B6560',
          fontFamily: 'DM Sans, sans-serif',
          marginBottom: '20px',
          margin: '0 0 20px 0',
        }}
      >
        Sources
      </p>

      {/* Source list */}
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {sources.map((source, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#6B6560',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {/* Number */}
            <span
              style={{
                color: '#1B5E3B',
                fontWeight: '600',
                flexShrink: 0,
                minWidth: '18px',
              }}
            >
              {index + 1}.
            </span>

            {/* Source content */}
            <span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#1A1A1A',
                  fontWeight: '500',
                  textDecoration: 'none',
                  borderBottom: '1px solid #D4CFC8',
                  paddingBottom: '1px',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1B5E3B'
                  e.currentTarget.style.color = '#1B5E3B'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D4CFC8'
                  e.currentTarget.style.color = '#1A1A1A'
                }}
              >
                {source.name}
              </a>
              {' '}
              <span style={{ color: '#6B6560' }}>
                ({source.year})
              </span>
              {source.description && (
                <span style={{ color: '#6B6560' }}>
                  {' — '}{source.description}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {/* Disclaimer */}
      <p
        style={{
          fontSize: '12px',
          color: '#6B6560',
          fontFamily: 'DM Sans, sans-serif',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #D4CFC8',
          lineHeight: '1.6',
          fontStyle: 'italic',
        }}
      >
        NairaSavvy verifies information before publishing.
        Sources are linked for transparency. If you spot an
        error or an outdated figure, email us at
        hello@nairasavvy.ng and we will correct it.
      </p>
    </div>
  )
}
