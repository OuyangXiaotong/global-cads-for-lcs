'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { ERA_COLORS, FLAG, REGION_NAMES, regType } from '@/lib/types'

type Product = {
  id: number
  name: string
  fdaNumber: string | null
  year: number | null
  ce: boolean
  era: number
}

type Company = {
  id: number
  name: string
  region: string
  products: Product[]
}

function EraBar({ products }: { products: Product[] }) {
  const counts: Record<number, number> = {}
  products.forEach(p => { counts[p.era] = (counts[p.era] || 0) + 1 })
  const total = products.length
  return (
    <div className="flex h-1 w-10 rounded overflow-hidden flex-shrink-0">
      {[1, 2, 3, 4].filter(e => counts[e]).map(e => (
        <span
          key={e}
          style={{
            display: 'inline-block',
            width: `${Math.max(10, Math.round(counts[e] / total * 100))}%`,
            background: ERA_COLORS[e],
          }}
        />
      ))}
    </div>
  )
}

function ProdTag({ p }: { p: Product }) {
  if (p.fdaNumber && p.ce) return <span style={{ color: '#7A4F0A', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500 }}>FDA+CE</span>
  if (p.fdaNumber) return <span style={{ color: 'var(--fda-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500 }}>FDA</span>
  return <span style={{ color: 'var(--ce-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500 }}>CE</span>
}

export function CompanyCard({ company, defaultOpen = false }: { company: Company; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const rt = regType(company.products)

  return (
    <div
      style={{
        border: `1px solid ${open ? 'var(--ink2)' : 'var(--rule)'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        background: 'var(--bg)',
        boxShadow: open ? '0 2px 12px rgba(26,25,22,.06)' : 'none',
        transition: 'border-color .15s, box-shadow .15s',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-xl flex-shrink-0">{FLAG[company.region] || ''}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{company.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', marginTop: '1px' }}>
            {REGION_NAMES[company.region] || company.region}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {(rt === 'fda' || rt === 'both') && (
            <span style={{ background: 'var(--fda-bg)', color: 'var(--fda-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, padding: '3px 8px', borderRadius: '100px' }}>FDA</span>
          )}
          {(rt === 'ce' || rt === 'both') && (
            <span style={{ background: 'var(--ce-bg)', color: 'var(--ce-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, padding: '3px 8px', borderRadius: '100px' }}>CE</span>
          )}
          <span style={{ background: 'var(--bg2)', color: 'var(--ink2)', border: '1px solid var(--rule)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 8px', borderRadius: '100px' }}>
            {company.products.length} product{company.products.length > 1 ? 's' : ''}
          </span>
          <EraBar products={company.products} />
          <ChevronDown
            size={16}
            style={{ color: 'var(--ink3)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
          />
        </div>
      </div>

      {/* Product table */}
      {open && (
        <div style={{ borderTop: '1px solid var(--rule)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)' }}>
                {['Device name', 'Clearance', 'FDA submission', 'Year'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 3 ? 'right' : 'left',
                      padding: '8px 18px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                      color: 'var(--ink3)',
                      fontWeight: 500,
                      borderBottom: '1px solid var(--rule)',
                      whiteSpace: 'nowrap',
                    }}
                  >{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {company.products.map(p => (
                <tr key={p.id} className="hover:bg-[var(--bg2)] transition-colors">
                  <td style={{ padding: '9px 18px', color: 'var(--ink)', borderBottom: '1px solid var(--rule)', verticalAlign: 'middle' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: ERA_COLORS[p.era], marginRight: '8px', verticalAlign: 'middle' }} />
                    {p.name}
                  </td>
                  <td style={{ padding: '9px 18px', borderBottom: '1px solid var(--rule)', verticalAlign: 'middle' }}>
                    <ProdTag p={p} />
                  </td>
                  <td style={{ padding: '9px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', borderBottom: '1px solid var(--rule)', verticalAlign: 'middle' }}>
                    {p.fdaNumber
                      ? <a href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${p.fdaNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fda-ink)', textDecoration: 'none' }} className="hover:underline">{p.fdaNumber}</a>
                      : '—'}
                  </td>
                  <td style={{ padding: '9px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', borderBottom: '1px solid var(--rule)', verticalAlign: 'middle', textAlign: 'right' }}>
                    {p.year || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 flex justify-end">
            <Link
              href={`/companies/${company.id}`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase' }}
              className="hover:text-[var(--ink)] transition-colors"
            >
              View details →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
