import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createCompany } from '@/app/actions'
import { REGION_NAMES } from '@/lib/types'

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--rule)',
  borderRadius: '8px',
  background: 'var(--bg)',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  color: 'var(--ink)',
  outline: 'none',
}

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '.06em',
  textTransform: 'uppercase' as const,
  color: 'var(--ink3)',
  display: 'block',
  marginBottom: '6px',
}

export default function NewCompanyPage() {
  if (process.env.GITHUB_ACTIONS) notFound()
  return (
    <main className="max-w-xl mx-auto px-8 py-12">
      <Link href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)', letterSpacing: '.06em', textTransform: 'uppercase' }} className="hover:text-[var(--ink)] transition-colors">
        ← Admin
      </Link>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 400, marginTop: '24px', marginBottom: '32px' }}>New Company</h1>

      <form action={createCompany} className="flex flex-col gap-5">
        <div>
          <label style={labelStyle}>Company name</label>
          <input name="name" type="text" required placeholder="e.g. Siemens Healthineers" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Region</label>
          <select name="region" required style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' as const }}>
            <option value="">Select region…</option>
            {Object.entries(REGION_NAMES).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{ background: 'var(--ink)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase', alignSelf: 'flex-start' }}
          className="hover:opacity-80 transition-opacity"
        >
          Create Company
        </button>
      </form>
    </main>
  )
}
