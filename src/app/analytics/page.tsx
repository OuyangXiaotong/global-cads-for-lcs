import { prisma } from '@/lib/db'
import { AnalyticsCharts } from './AnalyticsCharts'

export default async function AnalyticsPage() {
  const companies = await prisma.company.findMany({ include: { products: true } })
  const products = await prisma.product.findMany()

  // Approvals by year
  const byYear: Record<number, number> = {}
  products.filter(p => p.year).forEach(p => {
    byYear[p.year!] = (byYear[p.year!] || 0) + 1
  })
  const approvalsByYear = Object.entries(byYear)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year)

  // By region
  const byRegion: Record<string, number> = {}
  companies.forEach(c => { byRegion[c.region] = (byRegion[c.region] || 0) + c.products.length })
  const byRegionData = Object.entries(byRegion)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)

  // By era
  const byEra: Record<number, number> = {}
  products.forEach(p => { byEra[p.era] = (byEra[p.era] || 0) + 1 })
  const byEraData = [1, 2, 3, 4].map(era => ({ era, count: byEra[era] || 0 }))

  // Cumulative products over time
  let running = 0
  const cumulativeByYear = approvalsByYear.map(d => {
    running += d.count
    return { year: d.year, total: running }
  })

  // Clearance breakdown
  const fdaOnly = products.filter(p => p.fdaNumber && !p.ce).length
  const ceOnly = products.filter(p => !p.fdaNumber && p.ce).length
  const both = products.filter(p => p.fdaNumber && p.ce).length
  const clearanceData = [
    { name: 'FDA only', value: fdaOnly },
    { name: 'CE only', value: ceOnly },
    { name: 'FDA + CE', value: both },
  ]

  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'var(--ink3)' }} />
          Reference Database · Analytics
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 400 }}>Data Analytics</h1>
        <p style={{ fontSize: '14px', color: 'var(--ink2)', marginTop: '8px', fontWeight: 300 }}>
          {companies.length} companies · {products.length} products across {new Set(companies.map(c => c.region)).size} regions
        </p>
      </div>

      <AnalyticsCharts
        approvalsByYear={approvalsByYear}
        cumulativeByYear={cumulativeByYear}
        byRegionData={byRegionData}
        byEraData={byEraData}
        clearanceData={clearanceData}
      />
    </main>
  )
}
