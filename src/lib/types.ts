export type Region = 'US' | 'EU' | 'KR' | 'CN' | 'JP' | 'AU' | 'IL' | 'FR'
export type RegFilter = 'fda' | 'ce' | 'both' | ''
export type SortKey = 'name' | 'products' | 'year'

export const ERA_LABELS: Record<number, string> = {
  1: 'Rule-based',
  2: 'ML / Radiomics',
  3: 'Deep learning',
  4: 'VLM / Multimodal',
}

export const ERA_YEARS: Record<number, string> = {
  1: '2001–2009',
  2: '2010–2016',
  3: '2017–2022',
  4: '2023–2026',
}

export const ERA_COLORS: Record<number, string> = {
  1: '#5F5E5A',
  2: '#185FA5',
  3: '#2D6A1F',
  4: '#8B3A1A',
}

export const FLAG: Record<string, string> = {
  US: '🇺🇸', EU: '🇪🇺', KR: '🇰🇷', CN: '🇨🇳',
  JP: '🇯🇵', AU: '🇦🇺', IL: '🇮🇱', FR: '🇫🇷',
}

export const REGION_NAMES: Record<string, string> = {
  US: 'United States', EU: 'Europe', KR: 'South Korea',
  CN: 'China', JP: 'Japan', AU: 'Australia',
  IL: 'Israel', FR: 'France',
}

export function regType(products: { fdaNumber: string | null; ce: boolean }[]) {
  const f = products.some(p => p.fdaNumber)
  const c = products.some(p => p.ce)
  return f && c ? 'both' : f ? 'fda' : 'ce'
}

export function firstYear(products: { year: number | null }[]) {
  const ys = products.map(p => p.year).filter((y): y is number => y !== null)
  return ys.length ? Math.min(...ys) : 9999
}
