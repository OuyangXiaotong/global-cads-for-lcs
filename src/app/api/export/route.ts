import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ERA_LABELS, REGION_NAMES } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'csv'

  const companies = await prisma.company.findMany({
    include: { products: { orderBy: { name: 'asc' } } },
    orderBy: { name: 'asc' },
  })

  if (format === 'bibtex') {
    const entries = companies.flatMap(co =>
      co.products.filter(p => p.fdaNumber || p.year).map(p => {
        const key = `${co.name.replace(/[^a-zA-Z]/g, '')}${p.year ?? 'n.d.'}`
        return `@misc{${key},
  author = {${co.name}},
  title  = {{${p.name}}},
  year   = {${p.year ?? 'n.d.'}},
  note   = {${[p.fdaNumber ? `FDA ${p.fdaNumber}` : '', p.ce ? 'CE marked' : ''].filter(Boolean).join('; ')}; Era ${p.era} — ${ERA_LABELS[p.era]}; ${REGION_NAMES[co.region] || co.region}},
}`
      })
    )

    return new Response(entries.join('\n\n'), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="lcs-cad-database.bib"',
      },
    })
  }

  // CSV
  const rows = [
    ['Company', 'Region', 'Product', 'FDA Number', 'Year', 'CE', 'Era', 'Era Label'].join(','),
    ...companies.flatMap(co =>
      co.products.map(p =>
        [
          `"${co.name.replace(/"/g, '""')}"`,
          co.region,
          `"${p.name.replace(/"/g, '""')}"`,
          p.fdaNumber ?? '',
          p.year ?? '',
          p.ce ? 'Yes' : 'No',
          p.era,
          `"${ERA_LABELS[p.era]}"`,
        ].join(',')
      )
    ),
  ]

  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="lcs-cad-database.csv"',
    },
  })
}
