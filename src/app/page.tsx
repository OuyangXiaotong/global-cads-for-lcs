import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { DatabaseView } from '@/components/DatabaseView'

export default async function HomePage() {
  const companies = await prisma.company.findMany({
    include: { products: true },
    orderBy: { name: 'asc' },
  })

  const totalProducts = companies.reduce((s, c) => s + c.products.length, 0)
  const fdaCount = companies.reduce((s, c) => s + c.products.filter(p => p.fdaNumber).length, 0)
  const regions = new Set(companies.map(c => c.region)).size

  const stats = [
    { n: companies.length, label: 'Companies' },
    { n: totalProducts, label: 'Total products' },
    { n: fdaCount, label: 'FDA-cleared' },
    { n: regions, label: 'Regions' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-8 pb-16">
      <header style={{ borderBottom: '1px solid var(--rule)', padding: '48px 0 40px', marginBottom: '40px' }}>
        <div className="flex items-end gap-12 flex-wrap">
          <div className="flex-1 min-w-64">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'var(--ink3)' }} />
              Systematic Review · Reference Database
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-.01em', marginBottom: '14px' }}>
              Global Commercial CADs<br />
              for <em style={{ fontStyle: 'italic', color: 'var(--ink2)' }}>Lung Cancer Screening</em>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink2)', maxWidth: '520px', lineHeight: 1.7, fontWeight: 300 }}>
              FDA 510(k)/PMA-cleared and CE-marked software devices for pulmonary nodule detection and management. Compiled from regulatory databases and published literature.
            </p>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 400, color: 'var(--bg3)', lineHeight: 1, letterSpacing: '-.04em', flexShrink: 0, userSelect: 'none' }}>
            2001<br />–2026
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: '10px', overflow: 'hidden', marginBottom: '36px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg)', padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 400, lineHeight: 1, marginBottom: '4px' }}>{s.n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Suspense>
        <DatabaseView companies={companies} />
      </Suspense>

      <footer style={{ marginTop: '56px', paddingTop: '28px', borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
        <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.7, maxWidth: '520px', fontWeight: 300 }}>
          <strong style={{ color: 'var(--ink2)', fontWeight: 500 }}>Data sources:</strong> FDA 510(k)/PMA database (CDRH); European CE-mark AI registries including AIforRadiology.com; published systematic reviews. Products limited to CT-based lung nodule detection and management tools.
        </p>
        <div className="ml-auto text-right">
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--ink2)' }}>LCS CAD Reference Database</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: '4px' }}>Compiled May 2026 · v1.0</div>
        </div>
      </footer>
    </main>
  )
}
