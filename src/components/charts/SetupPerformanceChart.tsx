'use client'

import { SetupPerformance } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SetupPerformanceChartProps {
  data: SetupPerformance[]
  title: string
  dataKey: 'winRate' | 'totalPnL'
  yAxisFormatter?: (value: number) => string
}

export function SetupPerformanceChart({ data, title, dataKey, yAxisFormatter }: SetupPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No setup data available
      </div>
    )
  }

  const formatTooltip = (value: any, name: any) => {
    if (dataKey === 'winRate') {
      return [`${Number(value).toFixed(1)}%`, 'Win Rate']
    } else if (dataKey === 'totalPnL') {
      return [`$${Number(value).toFixed(2)}`, 'Total P&L']
    }
    return [value, name]
  }

  const isSingleItem = data.length === 1
  const barWidth = data.length <= 3 ? 40 : data.length <= 5 ? 35 : 30

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ overflow: 'visible' }}>
      <BarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barCategoryGap={isSingleItem ? '60%' : '20%'}
      >
        <defs>
          <linearGradient id="setupWinRateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4}/>
          </linearGradient>
          <linearGradient id="setupPnLGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dataKey === 'totalPnL' ? '#10B981' : '#3B82F6'} stopOpacity={0.8}/>
            <stop offset="100%" stopColor={dataKey === 'totalPnL' ? '#10B981' : '#3B82F6'} stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={1}
          vertical={false}
        />
        
        <XAxis 
          dataKey="setup" 
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
          tickFormatter={yAxisFormatter || ((value) => dataKey === 'winRate' ? `${Number(value).toFixed(0)}%` : `$${Number(value).toFixed(0)}`)}
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
          dataKey={dataKey} 
          name={title}
          radius={[4, 4, 0, 0]}
          maxBarSize={barWidth}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={dataKey === 'totalPnL' && entry.totalPnL < 0 ? 'url(#negativeGradient)' : 'url(#setupPnLGradient)'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}