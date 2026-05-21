'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'
import { ERA_COLORS, ERA_LABELS, REGION_NAMES } from '@/lib/types'

const CHART_COLORS = ['#185FA5', '#2D6A1F', '#8B3A1A', '#5F5E5A', '#7A4F0A', '#1A6B3A', '#9A968F', '#1A4A8A']

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--rule)', borderRadius: '10px', padding: '24px', background: 'var(--bg)' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, marginBottom: '20px' }}>{title}</h2>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: 'var(--bg)',
  border: '1px solid var(--rule)',
  borderRadius: '8px',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--ink)',
}

type Props = {
  approvalsByYear: { year: number; count: number }[]
  cumulativeByYear: { year: number; total: number }[]
  byRegionData: { region: string; count: number }[]
  byEraData: { era: number; count: number }[]
  clearanceData: { name: string; value: number }[]
}

export function AnalyticsCharts({ approvalsByYear, cumulativeByYear, byRegionData, byEraData, clearanceData }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))' }}>
      {/* Approvals over time */}
      <ChartCard title="FDA Approvals / CE Marks per Year">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={approvalsByYear} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--rule)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--bg2)' }} />
            <Bar dataKey="count" name="Products" fill="#185FA5" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Cumulative */}
      <ChartCard title="Cumulative Products Over Time">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={cumulativeByYear} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--rule)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--rule)' }} />
            <Line type="monotone" dataKey="total" name="Total products" stroke="#185FA5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By region */}
      <ChartCard title="Products by Region">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byRegionData} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 60 }}>
            <CartesianGrid stroke="var(--rule)" horizontal={false} />
            <XAxis type="number" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="region" tickFormatter={r => REGION_NAMES[r] || r} tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} width={64} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--bg2)' }} />
            <Bar dataKey="count" name="Products" radius={[0, 3, 3, 0]}>
              {byRegionData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By era */}
      <ChartCard title="Products by AI Era">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byEraData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--rule)" vertical={false} />
            <XAxis
              dataKey="era"
              tickFormatter={e => `Era ${e}`}
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }}
              tickLine={false} axisLine={false}
            />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--ink3)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'var(--bg2)' }}
              formatter={(v, _, props) => [v, `${ERA_LABELS[props.payload.era]}`]}
            />
            <Bar dataKey="count" name="Products" radius={[3, 3, 0, 0]}>
              {byEraData.map(d => <Cell key={d.era} fill={ERA_COLORS[d.era]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Clearance breakdown */}
      <ChartCard title="Clearance Breakdown">
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={clearanceData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {clearanceData.map((_, i) => (
                  <Cell key={i} fill={['#185FA5', '#2D6A1F', '#7A4F0A'][i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {clearanceData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: ['#185FA5', '#2D6A1F', '#7A4F0A'][i], display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink2)' }}>{d.name}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink)', marginLeft: '4px' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
