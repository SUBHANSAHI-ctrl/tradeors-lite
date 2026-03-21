'use client'

import { SetupPerformance, formatCurrency, formatPercentage, cn } from '@/lib/utils'

interface SetupPerformanceTableProps {
  data: SetupPerformance[]
}

export function SetupPerformanceTable({ data }: SetupPerformanceTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        No setup data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Setup
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Trades
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Win Rate
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total P&L
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Avg P&L
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((setup) => (
            <tr key={setup.setup} className="hover:bg-white/5 transition-colors duration-200">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                <div className="pair-badge px-2 py-1 rounded-md text-sm text-center">
                  {setup.setup}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                {setup.trades}
              </td>
              <td className={cn(
                "px-4 py-3 whitespace-nowrap text-sm font-mono",
                setup.winRate >= 50 ? 'text-green-400' : 'text-red-400'
              )}>
                {formatPercentage(setup.winRate)}
              </td>
              <td className={cn(
                "px-4 py-3 whitespace-nowrap text-sm font-bold font-mono",
                setup.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {formatCurrency(setup.totalPnL)}
              </td>
              <td className={cn(
                "px-4 py-3 whitespace-nowrap text-sm font-mono",
                setup.averagePnL >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {formatCurrency(setup.averagePnL)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}