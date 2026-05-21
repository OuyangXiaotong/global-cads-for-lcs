import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { updateCompany, deleteCompany, createProduct, updateProduct, deleteProduct } from '@/app/actions'
import { ERA_COLORS, ERA_LABELS, REGION_NAMES } from '@/lib/types'

export async function generateStaticParams() {
  return []
}

export const dynamicParams = false

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--rule)',
  borderRadius: '8px',
  background: 'var(--bg)',
  fontFamily: 'var(--font-sans)',
  fontSize: '13px',
  color: 'var(--ink)',
  outline: 'none',
}

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '.06em',
  textTransform: 'uppercase' as const,
  color: 'var(--ink3)',
  display: 'block',
  marginBottom: '5px',
}

export default async function EditCompanyPage(props: { params: Promise<{ id: string }> }) {
  if (process.env.GITHUB_ACTIONS) notFound()
  const { id } = await props.params
  const company = await prisma.company.findUnique({
    where: { id: Number(id) },
    include: { products: { orderBy: { name: 'asc' } } },
  })
  if (!company) notFound()

  const updateWithId = updateCompany.bind(null, company.id)
  const deleteWithId = deleteCompany.bind(null, company.id)
  const createProductWithCo = createProduct.bind(null, company.id)

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <Link href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase' }} className="hover:text-[var(--ink)] transition-colors">
        ← Admin
      </Link>

      {/* Company edit */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: '10px', padding: '24px', background: 'var(--bg)', marginTop: '24px', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, marginBottom: '20px' }}>Edit Company</h1>
        <form action={updateWithId} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Company name</label>
              <input name="name" type="text" required defaultValue={company.name} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <select name="region" required defaultValue={company.region} style={{ ...inputStyle, cursor: 'pointer' }}>
                {Object.entries(REGION_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" style={{ background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              Save Company
            </button>
            <Link href={`/companies/${company.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', border: '1px solid var(--rule)', borderRadius: '8px', padding: '8px 16px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              View Public →
            </Link>
          </div>
        </form>
        <form action={deleteWithId} className="mt-4 pt-4" style={{ borderTop: '1px solid var(--rule)' }}>
          <button type="submit" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8B1A1A', border: '1px solid #D4A0A0', borderRadius: '8px', padding: '7px 14px', background: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}
            onClick={(e) => { if (!confirm(`Delete ${company.name} and all its products?`)) e.preventDefault() }}>
            Delete Company
          </button>
        </form>
      </div>

      {/* Products */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 400, marginBottom: '16px' }}>
        Products <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink3)', fontWeight: 400 }}>({company.products.length})</span>
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        {company.products.map(p => {
          const updateProd = updateProduct.bind(null, p.id, company.id)
          const deleteProd = deleteProduct.bind(null, p.id, company.id)
          return (
            <details key={p.id} style={{ border: '1px solid var(--rule)', borderRadius: '10px', background: 'var(--bg)' }}>
              <summary style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', listStyle: 'none', userSelect: 'none' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ERA_COLORS[p.era], display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{p.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)' }}>Edit</span>
              </summary>
              <div style={{ padding: '16px', borderTop: '1px solid var(--rule)' }}>
                <form action={updateProd} className="flex flex-col gap-3">
                  <div>
                    <label style={labelStyle}>Product name</label>
                    <input name="name" type="text" required defaultValue={p.name} style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle}>FDA submission #</label>
                      <input name="fdaNumber" type="text" defaultValue={p.fdaNumber || ''} placeholder="e.g. K231157" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Year</label>
                      <input name="year" type="number" defaultValue={p.year || ''} placeholder="e.g. 2023" min="1990" max="2030" style={inputStyle} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={labelStyle}>AI Era (1–4)</label>
                      <select name="era" defaultValue={p.era} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {[1, 2, 3, 4].map(e => (
                          <option key={e} value={e}>Era {e} — {ERA_LABELS[e]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      <input name="ce" type="checkbox" id={`ce-${p.id}`} defaultChecked={p.ce} style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
                      <label htmlFor={`ce-${p.id}`} style={{ fontSize: '13px', color: 'var(--ink2)', cursor: 'pointer' }}>CE marked</label>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Notes</label>
                    <input name="notes" type="text" defaultValue={p.notes || ''} placeholder="Optional notes…" style={inputStyle} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" style={{ background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                      Save
                    </button>
                    <form action={deleteProd}>
                      <button type="submit" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8B1A1A', border: '1px solid #D4A0A0', borderRadius: '8px', padding: '7px 14px', background: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                        Delete
                      </button>
                    </form>
                  </div>
                </form>
              </div>
            </details>
          )
        })}
      </div>

      {/* Add product */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: '10px', padding: '20px', background: 'var(--bg2)' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '16px' }}>Add Product</h3>
        <form action={createProductWithCo} className="flex flex-col gap-3">
          <div>
            <label style={labelStyle}>Product name *</label>
            <input name="name" type="text" required placeholder="e.g. Lung-CAD v2" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>FDA submission #</label>
              <input name="fdaNumber" type="text" placeholder="e.g. K231157" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input name="year" type="number" placeholder="e.g. 2024" min="1990" max="2030" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>AI Era</label>
              <select name="era" defaultValue="3" style={{ ...inputStyle, cursor: 'pointer' }}>
                {[1, 2, 3, 4].map(e => (
                  <option key={e} value={e}>Era {e} — {ERA_LABELS[e]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input name="ce" type="checkbox" id="ce-new" style={{ width: '14px', height: '14px', cursor: 'pointer' }} />
              <label htmlFor="ce-new" style={{ fontSize: '13px', color: 'var(--ink2)', cursor: 'pointer' }}>CE marked</label>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <input name="notes" type="text" placeholder="Optional…" style={inputStyle} />
          </div>
          <button type="submit" style={{ background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
            Add Product
          </button>
        </form>
      </div>
    </main>
  )
}
