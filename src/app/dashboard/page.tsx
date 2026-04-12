'use client'

import { cn } from '@/lib/utils'
import { useTrades } from '@/hooks/useTrades'
import { useTradeFilters } from '@/hooks/useTradeFilters'
import { useUserProfile } from '@/hooks/useUserProfile'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { ReusableTradeFilters } from '@/components/trades/ReusableTradeFilters'
import { PremiumFeatureWrapper } from '@/components/dashboard/PremiumFeatureWrapper'
import { calculatePerformanceMetrics, formatCurrency, formatPercentage, getPnLColor, calculateSetupPerformance } from '@/lib/utils'
import { TrendingUp, DollarSign, Target, Zap, Activity } from 'lucide-react'
import { useRef } from 'react'
import { EquityCurveChart } from '@/components/charts/EquityCurveChart'
import { WinLossChart } from '@/components/charts/WinLossChart'
import { PairPerformanceChart } from '@/components/charts/PairPerformanceChart'
import { SetupPerformanceChart } from '@/components/charts/SetupPerformanceChart'
import { SetupPerformanceTable } from '@/components/charts/SetupPerformanceTable'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { BehaviorAlert } from '@/components/dashboard/BehaviorAlert'

export default function DashboardPage() {
  const { trades, loading } = useTrades()
  const { filters, filterOptions, filteredTrades, updateFilter, clearFilters, hasActiveFilters } = useTradeFilters(trades)
  const { profile, loading: profileLoading } = useUserProfile()
  const exportRef = useRef<HTMLDivElement>(null)
  
  if (loading || profileLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const metrics = calculatePerformanceMetrics(filteredTrades)

  return (
    <AuthGuard>
      <DashboardLayout>
<div className="space-y-8">
          {/* Behavior Intelligence System — sits outside export ref, runs on raw trades */}
          <BehaviorAlert trades={trades} plan={profile?.plan ?? 'free'} />

          {/* Dedicated export container - only dashboard content without header/buttons */}
          <div ref={exportRef} className="space-y-8">
            {/* Header - Premium styling with filters */}
            <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#DDE4F0] tracking-tight">
                  Trading Dashboard
                </h1>
                <p className="text-[#4A5880] mt-1 text-xs uppercase tracking-widest">
                  Performance Analytics
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] text-[#4A5880] uppercase tracking-wider mb-0.5">Last Updated</div>
                  <div className="text-sm font-mono text-[#2DD4BF]">
                    {new Date().toLocaleTimeString()}
                  </div>
                  <div className="text-[10px] text-[#4A5880]">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Global Trade Filters - Controlled component with single source of truth */}
            <ReusableTradeFilters 
              trades={trades}
              filters={filters}
              filterOptions={filterOptions}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Filter Status */}
            {hasActiveFilters && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm text-blue-400">
                  Dashboard analytics are now showing filtered results
                </p>
              </div>
            )}
          </div>

          {/* Filter Context Header */}
          {hasActiveFilters && (
            <div className="glass rounded-2xl p-4 border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-yellow-400 font-medium">Filtered Analytics Active</span>
                </div>
                <div className="text-sm text-gray-400">
                  Showing {filteredTrades.length} of {trades.length} trades
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Grid - Premium cards with filtered data - Improved responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            <MetricsCard
              title="Total Trades"
              value={metrics.totalTrades}
              icon={<Activity className="h-6 w-6 text-blue-400" />}
              subtitle={hasActiveFilters ? `Filtered from ${trades.length}` : 'All Trades'}
            />
            
            <MetricsCard
              title="Win Rate"
              value={formatPercentage(metrics.winRate)}
              change={`${metrics.wins}W / ${metrics.losses}L`}
              changeType={metrics.winRate >= 50 ? 'positive' : 'negative'}
              icon={<Target className="h-6 w-6 text-green-400" />}
            />
            
            <MetricsCard
              title="Total P&L"
              value={formatCurrency(metrics.totalPnL)}
              changeType={metrics.totalPnL >= 0 ? 'positive' : 'negative'}
              icon={<DollarSign className="h-6 w-6 text-yellow-400" />}
            />
            
            <MetricsCard
              title="Average Trade"
              value={formatCurrency(metrics.averageTrade)}
              changeType={metrics.averageTrade >= 0 ? 'positive' : 'negative'}
              icon={<TrendingUp className="h-6 w-6 text-purple-400" />}
            />
            
            <MetricsCard
              title="Profit Factor"
              value={metrics.profitFactor.toFixed(2)}
              change={metrics.profitFactor >= 1.5 ? 'Excellent' : metrics.profitFactor >= 1 ? 'Good' : 'Needs Improvement'}
              changeType={metrics.profitFactor >= 1.5 ? 'positive' : metrics.profitFactor >= 1 ? 'neutral' : 'negative'}
              icon={<Zap className="h-6 w-6 text-orange-400" />}
            />
            
            <MetricsCard
              title="Best Pair"
              value={metrics.bestPerformingPair}
              icon={<TrendingUp className="h-6 w-6 text-green-400" />}
            />
          </div>

          {/* Charts Section - Fixed chart containers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Equity Curve */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Equity Curve</span>
                </h3>
                <div className="text-xs text-gray-400 font-mono">
                  {filteredTrades.length} data points
                </div>
              </div>
              <div className="h-64 md:h-72">
                <EquityCurveChart trades={filteredTrades} />
              </div>
            </div>

            {/* Win/Loss Distribution */}
            <WinLossChart trades={filteredTrades} />
          </div>

          {/* Pair Performance - Premium Feature (Advanced Analytics) */}
          <PremiumFeatureWrapper
            featureType="analytics"
            title="Discover Your Most Profitable Pairs"
            description="See which trading pairs make you the most money and focus your efforts where they count"
          >
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Performance by Pair</span>
                </h3>
                <div className="text-xs text-gray-400 font-mono">
                  Performance breakdown
                </div>
              </div>
              <div className="h-64 md:h-72">
                <PairPerformanceChart trades={filteredTrades} />
              </div>
            </div>
          </PremiumFeatureWrapper>

          {/* Setup Performance Analytics - Premium Features (Advanced Analytics & Advanced Charts) */}
          {filteredTrades.length > 0 && (
            <PremiumFeatureWrapper
              featureType="analytics"
              title="Find Your Winning Strategies"
              description="Identify which trading setups generate the most profit and replicate your success"
            >
              <div className="space-y-6">
                {/* Setup Performance Header */}
                <div className="flex items-center justify-between glass rounded-2xl p-6 border border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Setup Performance Analytics
                    </h2>
                    <p className="text-gray-400 mt-1 font-mono text-sm">
                      STRATEGY INSIGHTS • PROFITABILITY ANALYSIS
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {calculateSetupPerformance(filteredTrades).length} active setups
                  </div>
                </div>

                {/* Setup Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Win Rate by Setup */}
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span>Win Rate by Setup</span>
                      </h3>
                      <div className="text-xs text-gray-400 font-mono">
                        Success rate analysis
                      </div>
                    </div>
                    <div className="h-64 md:h-72">
                      <SetupPerformanceChart 
                        data={calculateSetupPerformance(filteredTrades)} 
                        title="Win Rate"
                        dataKey="winRate"
                        yAxisFormatter={(value) => `${Number(value).toFixed(0)}%`}
                      />
                    </div>
                  </div>

                  {/* PnL by Setup */}
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span>P&L by Setup</span>
                      </h3>
                      <div className="text-xs text-gray-400 font-mono">
                        Profitability breakdown
                      </div>
                    </div>
                    <div className="h-64 md:h-72">
                      <SetupPerformanceChart 
                        data={calculateSetupPerformance(filteredTrades)} 
                        title="Total P&L"
                        dataKey="totalPnL"
                      />
                    </div>
                  </div>
                </div>

                {/* Setup Performance Table */}
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span>Setup Performance Summary</span>
                    </h3>
                    <div className="text-xs text-gray-400 font-mono">
                      Detailed metrics
                    </div>
                  </div>
                  <SetupPerformanceTable data={calculateSetupPerformance(filteredTrades)} />
                </div>
              </div>
            </PremiumFeatureWrapper>
          )}

          {/* Recent Trades - Fixed table layout */}
          {filteredTrades.length > 0 ? (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span>Recent Trades</span>
                </h3>
                <div className="text-xs text-gray-400 font-mono">
                  Last 5 trades
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="data-table min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Pair
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Direction
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Entry
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        P&L
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Setup
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredTrades.slice(0, 5).map((trade) => (
                      <tr key={trade.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                          {new Date(trade.trade_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="pair-badge px-2 py-1 rounded-md text-sm font-medium text-white text-center">
                            {trade.pair}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex px-2 py-1 text-xs font-bold rounded-md border",
                            trade.direction === 'long' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          )}>
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                          ${trade.entry_price.toFixed(2)}
                        </td>
                        <td className={cn(
                          "px-4 py-3 whitespace-nowrap text-sm font-bold font-mono",
                          getPnLColor(trade.pnl)
                        )}>
                          {formatCurrency(trade.pnl)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 font-mono">
                          {trade.setup_tag}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Trades Found</h3>
                <p className="text-sm">
                  Your current filters don't match any trades. Try adjusting your filters or 
                  <a href="/dashboard/trades/add" className="text-blue-400 hover:text-blue-300 ml-1">
                    add a new trade
                  </a>.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    // This will trigger the clear filters functionality from the hook
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Clear Filters
                </button>
                <a
                  href="/dashboard/trades/add"
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Add Trade
                </a>
              </div>
            </div>
          )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
