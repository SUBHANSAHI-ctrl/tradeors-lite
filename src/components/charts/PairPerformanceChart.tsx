'use client'

import { Trade } from '@/types/trade'
import { calculatePairPerformance } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PairPerformanceChartProps {
  trades: Trade[]
}

interface ChartData {
  pair: string
  totalPnL: number
  winRate: number
  trades: number
}

export function PairPerformanceChart({ trades }: PairPerformanceChartProps) {
  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No trade data available
      </div>
    )
  }

  const pairData = calculatePairPerformance(trades)
    .sort((a, b) => b.totalPnL - a.totalPnL)
    .slice(0, 10) // Show top 10 pairs

  const formatTooltip = (value: any, name: any) => {
    if (name === 'totalPnL') {
      return [`$${Number(value).toFixed(2)}`, 'Total P&L']
    } else if (name === 'winRate') {
      return [`${Number(value).toFixed(1)}%`, 'Win Rate']
    } else if (name === 'trades') {
      return [value, 'Number of Trades']
    }
    return [value, name]
  }

  // Determine optimal bar width based on data count
  const barWidth = pairData.length <= 3 ? 40 : pairData.length <= 5 ? 35 : 30
  const isSingleItem = pairData.length === 1

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={pairData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barCategoryGap={isSingleItem ? '60%' : '20%'}
      >
        <defs>
          <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.4}/>
          </linearGradient>
          <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={1}
          vertical={false}
        />
        
        <XAxis 
          dataKey="pair" 
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          height={isSingleItem ? 40 : 60}
          interval={0}
          angle={isSingleItem ? 0 : -30}
          textAnchor={isSingleItem ? 'middle' : 'end'}
        />
        
        <YAxis 
          tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            padding: '12px 16px'
          }}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        
        <Bar 
          dataKey="totalPnL" 
          name="Total P&L"
          radius={[4, 4, 0, 0]}
          maxBarSize={barWidth}
        >
          {pairData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.totalPnL >= 0 ? 'url(#positiveGradient)' : 'url(#negativeGradient)'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}