'use client'

import { generateEquityCurve } from '@/lib/utils'
import { Trade } from '@/types/trade'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface EquityCurveChartProps {
  trades: Trade[]
}

interface ChartData {
  date: string
  equity: number
}

export function EquityCurveChart({ trades }: EquityCurveChartProps) {
  const data = generateEquityCurve(trades)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No trade data available
      </div>
    )
  }

  const formatXAxis = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString()
  }

  const formatTooltip = (value: any, name: any) => {
    if (value === undefined || value === null) return ['', '']
    return [`$${Number(value).toFixed(2)}`, 'Equity']
  }

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ overflow: 'visible' }}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={1}
          vertical={false}
        />
        
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis}
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        
        <YAxis 
          tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          stroke="rgba(255,255,255,0.6)"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        
        <Tooltip 
          formatter={formatTooltip}
          labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            padding: '12px 16px'
          }}
          cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
        />
        
        <Line 
          type="monotone" 
          dataKey="equity" 
          stroke="#3B82F6" 
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#equityGradient)"
          dot={{ 
            fill: '#3B82F6', 
            strokeWidth: 2, 
            r: 6,
            stroke: '#1F2937',
            filter: 'url(#glow)'
          }}
          activeDot={{ 
            r: 8, 
            stroke: '#3B82F6', 
            strokeWidth: 3,
            fill: '#60A5FA',
            filter: 'url(#glow)'
          }}
          filter="url(#glow)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}