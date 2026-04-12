'use client'

import { Trade } from '@/types/trade'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface WinLossChartProps {
  trades: Trade[]
}

export function WinLossChart({ trades }: WinLossChartProps) {
  if (trades.length === 0) {
    return (
      <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-6 flex items-center justify-center min-h-70 text-[#4A5880] text-sm">
        No trade data available
      </div>
    )
  }

  // ── Original data logic (unchanged) ──────────────────
  const wins      = trades.filter(trade => trade.pnl > 0).length
  const losses    = trades.filter(trade => trade.pnl < 0).length
  const breakeven = trades.filter(trade => trade.pnl === 0).length

  const data = [
    { name: 'Wins',      value: wins,      color: '#2DD4BF' },
    { name: 'Losses',    value: losses,    color: '#3A4666' },
    { name: 'Breakeven', value: breakeven, color: '#1E2844' },
  ].filter(item => item.value > 0)

  const formatTooltip = (value: any, name: any) => {
    const total = trades.length
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
    return [`${value} (${percentage}%)`, name]
  }
  // ─────────────────────────────────────────────────────

  const winRate = trades.length > 0
    ? Math.round((wins / trades.length) * 100)
    : 0

  return (
    <div className="bg-[#131826] border border-[#1A2540] hover:border-[#4361EE]/30 rounded-xl p-6 flex flex-col gap-5 transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
          <span className="text-sm font-semibold text-[#DDE4F0]">Win / Loss Distribution</span>
        </div>
        <span className="text-sm text-[#7B8BB0]">{winRate}% win rate</span>
      </div>

      {/* ── Donut chart + center overlay ───────────────── */}
      <div className="relative flex items-center justify-center" style={{ height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={62}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: '#0F1220',
                border: '1px solid #1A2540',
                borderRadius: '8px',
                color: '#DDE4F0',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              itemStyle={{ color: '#DDE4F0' }}
              labelStyle={{ color: '#7B8BB0' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center metric — absolute over the donut hole */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-[#DDE4F0] leading-none">{winRate}%</span>
          <span className="text-xs text-[#7B8BB0] mt-1">Wins</span>
        </div>
      </div>

      {/* ── Custom legend ───────────────────────────────── */}
      <div className="flex items-center justify-center gap-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[#7B8BB0]">
              {item.name}{' '}
              <span className="text-[#DDE4F0] font-medium">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
