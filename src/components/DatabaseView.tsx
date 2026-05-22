'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { CompanyCard } from './CompanyCard'
import { regType, firstYear, REGION_NAMES, ERA_COLORS, ERA_LABELS, ERA_YEARS } from '@/lib/types'

type Product = { id: number; name: string; fdaNumber: string | null; year: number | null; ce: boolean; era: number }
type Company = { id: number; name: string; region: string; products: Product[] }

const REGIONS = ['AU', 'AT', 'CN', 'FR', 'DE', 'IL', 'IN', 'JP', 'LT', 'NL', 'PT', 'KR', 'GB', 'US']

export function DatabaseView({ companies }: { companies: Company[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const q = searchParams.get('q') ?? ''
  const reg = searchParams.get('reg') ?? ''
  const region = searchParams.get('region') ?? ''
  const eraF = searchParams.get('era') ?? ''
  const sort = (searchParams.get('sort') ?? 'name') as 'name' | 'products' | 'year-asc' | 'year-desc'

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filtered = useMemo(() => {
    let data = companies.filter(co => {
      if (q && !(co.name.toLowerCase().includes(q.toLowerCase()) || co.products.some(p => p.name.toLowerCase().includes(q.toLowerCase())))) return false
      if (reg && regType(co.products) !== reg) return false
      if (region && co.region !== region) return false
      if (eraF && !co.products.some(p => p.era === +eraF)) return false
      return true
    })
    if (sort === 'name') data = [...data].sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'products') data = [...data].sort((a, b) => b.products.length - a.products.length)
    else if (sort === 'year-asc') data = [...data].sort((a, b) => firstYear(a.products) - firstYear(b.products))
    else if (sort === 'year-desc') data = [...data].sort((a, b) => firstYear(b.products) - firstYear(a.products))
    return data
  }, [companies, q, reg, region, eraF, sort])

  const totalProds = filtered.reduce((s, c) => s + c.products.length, 0)

  const selectStyle = {
    padding: '8px 28px 8px 10px',
    border: '1px solid var(--rule)',
    borderRadius: '8px',
    background: 'var(--bg)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    color: 'var(--ink)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A968F' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
  }

  return (
    <>
      {/* Era legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 2, 3, 4].map(e => (
          <div
            key={e}
            className="flex items-center gap-2 text-xs cursor-pointer"
            style={{
              color: 'var(--ink2)',
              background: eraF === String(e) ? 'var(--bg3)' : 'var(--bg2)',
              border: '1px solid var(--rule)',
              borderRadius: '100px',
              padding: '5px 12px',
            }}
            onClick={() => setParam('era', eraF === String(e) ? '' : String(e))}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ERA_COLORS[e], display: 'inline-block', flexShrink: 0 }} />
            Era {e} — {ERA_LABELS[e]}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>{ERA_YEARS[e]}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center mb-5">
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ink3)' }} />
          <input
            type="text"
            placeholder="Search companies or products…"
            value={q}
            onChange={e => setParam('q', e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              border: '1px solid var(--rule)',
              borderRadius: '8px',
              background: 'var(--bg)',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
        </div>
        <select value={reg} onChange={e => setParam('reg', e.target.value)} style={selectStyle}>
          <option value="">All clearances</option>
          <option value="fda">FDA cleared</option>
          <option value="ce">CE marked only</option>
          <option value="both">FDA + CE</option>
        </select>
        <select value={region} onChange={e => setParam('region', e.target.value)} style={selectStyle}>
          <option value="">All regions</option>
          {REGIONS.map(r => <option key={r} value={r}>{REGION_NAMES[r]}</option>)}
        </select>
        <select value={sort} onChange={e => setParam('sort', e.target.value)} style={selectStyle}>
          <option value="name">Company A → Z</option>
          <option value="products">Most products</option>
          <option value="year-asc">Earliest FDA approval</option>
          <option value="year-desc">Latest FDA approval</option>
        </select>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          {filtered.length} companies · {totalProds} products
        </span>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-1">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink3)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            No results match your filters.
          </div>
        ) : (
          filtered.map(co => <CompanyCard key={co.id} company={co} />)
        )}
      </div>
    </>
  )
}
