'use client'

import { Trade } from '@/types/trade'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface WinLossChartProps {
  trades: Trade[]
}

export function WinLossChart({ trades }: WinLossChartProps) {
  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No trade data available
      </div>
    )
  }

  const wins = trades.filter(trade => trade.pnl > 0).length
  const losses = trades.filter(trade => trade.pnl < 0).length
  const breakeven = trades.filter(trade => trade.pnl === 0).length

  const data = [
    { name: 'Wins', value: wins, color: '#10B981' },
    { name: 'Losses', value: losses, color: '#EF4444' },
    { name: 'Breakeven', value: breakeven, color: '#6B7280' }
  ].filter(item => item.value > 0)

  const formatTooltip = (value: any, name: any) => {
    const total = trades.length
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
    return [`${value} (${percentage}%)`, name]
  }

  const renderLabel = (props: any) => {
    const { name, percent } = props
    if (percent === undefined) return name
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#F3F4F6' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}