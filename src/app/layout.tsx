import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display, DM_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'LCS CAD Reference Database',
  description: 'Global commercial CADs for lung cancer screening — FDA & CE reference database',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${dmMono.variable}`}>
      <body className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>
        <nav style={{ borderBottom: '1px solid var(--rule)', background: 'var(--bg2)' }}>
          <div className="max-w-6xl mx-auto px-8 h-12 flex items-center gap-6">
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--ink)', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
              LCS CAD
            </Link>
            <div className="flex items-center gap-5 ml-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink3)' }}>
              <Link href="/" className="hover:text-[var(--ink)] transition-colors">DATABASE</Link>
              <Link href="/analytics" className="hover:text-[var(--ink)] transition-colors">ANALYTICS</Link>
              {!process.env.GITHUB_ACTIONS && (
                <Link href="/admin" className="hover:text-[var(--ink)] transition-colors">ADMIN</Link>
              )}
            </div>
            {!process.env.GITHUB_ACTIONS && (
              <div className="ml-auto flex items-center gap-3">
                <a href="/api/export?format=csv" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', border: '1px solid var(--rule)', borderRadius: '6px', padding: '4px 10px' }} className="hover:border-[var(--ink3)] transition-colors">
                  CSV
                </a>
                <a href="/api/export?format=bibtex" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink3)', border: '1px solid var(--rule)', borderRadius: '6px', padding: '4px 10px' }} className="hover:border-[var(--ink3)] transition-colors">
                  BibTeX
                </a>
              </div>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
