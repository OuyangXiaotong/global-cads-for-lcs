import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { FLAG, REGION_NAMES, regType } from '@/lib/types'

export default async function AdminPage() {
  if (process.env.GITHUB_ACTIONS) notFound()
  const companies = await prisma.company.findMany({
    include: { products: true },
    orderBy: { name: 'asc' },
  })

  return (
    <main className="max-w-4xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '8px' }}>
            Admin Panel
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400 }}>Companies</h1>
        </div>
        <Link
          href="/admin/companies/new"
          style={{ background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '9px 16px', borderRadius: '8px', letterSpacing: '.04em', textTransform: 'uppercase' }}
          className="hover:opacity-80 transition-opacity"
        >
          + New Company
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        {companies.map(co => {
          const rt = regType(co.products)
          return (
            <Link
              key={co.id}
              href={`/admin/companies/${co.id}/edit`}
              style={{ border: '1px solid var(--rule)', borderRadius: '10px', padding: '14px 18px', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
              className="hover:border-[var(--ink3)] transition-colors"
            >
              <span style={{ fontSize: '20px' }}>{FLAG[co.region] || ''}</span>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{co.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', marginTop: '1px' }}>
                  {REGION_NAMES[co.region] || co.region} · {co.products.length} product{co.products.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(rt === 'fda' || rt === 'both') && <span style={{ background: 'var(--fda-bg)', color: 'var(--fda-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, padding: '3px 8px', borderRadius: '100px' }}>FDA</span>}
                {(rt === 'ce' || rt === 'both') && <span style={{ background: 'var(--ce-bg)', color: 'var(--ce-ink)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, padding: '3px 8px', borderRadius: '100px' }}>CE</span>}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)' }}>Edit →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
