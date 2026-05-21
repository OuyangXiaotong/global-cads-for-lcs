import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { ERA_COLORS, ERA_LABELS, FLAG, REGION_NAMES, regType } from '@/lib/types'

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { id: true } })
  return companies.map(c => ({ id: String(c.id) }))
}

export default async function CompanyPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const company = await prisma.company.findUnique({
    where: { id: Number(id) },
    include: { products: { orderBy: [{ year: 'asc' }, { name: 'asc' }] } },
  })
  if (!company) notFound()

  const rt = regType(company.products)
  const fdaProducts = company.products.filter(p => p.fdaNumber)
  const ceProducts = company.products.filter(p => p.ce)
  const firstApproval = company.products.map(p => p.year).filter(Boolean).sort()[0]
  const eras = [...new Set(company.products.map(p => p.era))].sort()

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase' }} className="hover:text-[var(--ink)] transition-colors">
        ← Back to database
      </Link>

      <div style={{ marginTop: '32px', marginBottom: '40px', borderBottom: '1px solid var(--rule)', paddingBottom: '32px' }}>
        <div className="flex items-center gap-4 mb-4">
          <span style={{ fontSize: '40px' }}>{FLAG[company.region] || ''}</span>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 400, lineHeight: 1.2 }}>{company.name}</h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink3)', marginTop: '4px' }}>
              {REGION_NAMES[company.region] || company.region}
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(rt === 'fda' || rt === 'both') && (
            <span style={{ background: 'var(--fda-bg)', color: 'var(--fda-ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px' }}>
              {fdaProducts.length} FDA-cleared
            </span>
          )}
          {(rt === 'ce' || rt === 'both') && (
            <span style={{ background: 'var(--ce-bg)', color: 'var(--ce-ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px' }}>
              {ceProducts.length} CE-marked
            </span>
          )}
          {firstApproval && (
            <span style={{ background: 'var(--bg2)', border: '1px solid var(--rule)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink2)', padding: '4px 10px', borderRadius: '100px' }}>
              First approval: {firstApproval}
            </span>
          )}
          {eras.map(e => (
            <span key={e} style={{ background: 'var(--bg2)', border: '1px solid var(--rule)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink2)', padding: '4px 10px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ERA_COLORS[e], display: 'inline-block' }} />
              Era {e} — {ERA_LABELS[e]}
            </span>
          ))}
        </div>
      </div>

      {/* Products */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, marginBottom: '16px' }}>
        Products <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink3)', fontWeight: 400 }}>({company.products.length})</span>
      </h2>

      <div className="flex flex-col gap-3">
        {company.products.map(p => (
          <div key={p.id} style={{ border: '1px solid var(--rule)', borderRadius: '10px', padding: '16px 20px', background: 'var(--bg)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ERA_COLORS[p.era], flexShrink: 0, display: 'inline-block', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', marginTop: '4px' }}>
                    Era {p.era} — {ERA_LABELS[p.era]}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.fdaNumber && p.ce && <span style={{ color: '#7A4F0A', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500 }}>FDA+CE</span>}
                {p.fdaNumber && !p.ce && <span style={{ color: 'var(--fda-ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500 }}>FDA</span>}
                {!p.fdaNumber && p.ce && <span style={{ color: 'var(--ce-ink)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500 }}>CE</span>}
              </div>
            </div>
            <div className="flex gap-6 mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)' }}>
              {p.fdaNumber && (
                <span>FDA: <a href={`https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${p.fdaNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fda-ink)', textDecoration: 'none' }} className="hover:underline">{p.fdaNumber}</a></span>
              )}
              {p.year && (
                <span>Year: <span style={{ color: 'var(--ink2)' }}>{p.year}</span></span>
              )}
              {p.notes && (
                <span style={{ color: 'var(--ink2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>{p.notes}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit link */}
      <div className="mt-8 flex justify-end">
        <Link
          href={`/admin/companies/${company.id}/edit`}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '7px 14px', letterSpacing: '.04em', textTransform: 'uppercase' }}
          className="hover:border-[var(--ink3)] hover:text-[var(--ink)] transition-colors"
        >
          Edit in Admin →
        </Link>
      </div>
    </main>
  )
}
