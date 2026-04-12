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
import { GrowthWidget } from '@/components/dashboard/GrowthWidget'

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
            <div className="text-[#4A5880] text-sm">Loading dashboard...</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const metrics = calculatePerformanceMetrics(filteredTrades)

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">

          {/* Behavior Intelligence System — runs on raw trades, outside export ref */}
          <BehaviorAlert trades={trades} plan={profile?.plan ?? 'free'} />

          {/* Trading Growth System */}
          <GrowthWidget trades={trades} plan={profile?.plan ?? 'free'} />

          <div ref={exportRef} className="space-y-5">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#DDE4F0] tracking-tight">
                  Trading Dashboard
                </h1>
                <p className="text-[#4A5880] mt-0.5 text-xs uppercase tracking-widest">
                  Performance Analytics
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-[10px] text-[#4A5880] uppercase tracking-wider mb-0.5">Last Updated</div>
                <div className="text-sm font-mono text-[#2DD4BF]">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Filters */}
            <ReusableTradeFilters
              trades={trades}
              filters={filters}
              filterOptions={filterOptions}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <MetricsCard
                title="Total Trades"
                value={metrics.totalTrades}
                icon={<Activity className="h-5 w-5 text-[#4361EE]" />}
                subtitle={hasActiveFilters ? `Filtered from ${trades.length}` : 'All Trades'}
              />
              <MetricsCard
                title="Win Rate"
                value={formatPercentage(metrics.winRate)}
                change={`${metrics.wins}W / ${metrics.losses}L`}
                changeType={metrics.winRate >= 50 ? 'positive' : 'negative'}
                icon={<Target className="h-5 w-5 text-emerald-400" />}
              />
              <MetricsCard
                title="Total P&L"
                value={formatCurrency(metrics.totalPnL)}
                changeType={metrics.totalPnL >= 0 ? 'positive' : 'negative'}
                icon={<DollarSign className="h-5 w-5 text-[#2DD4BF]" />}
              />
              <MetricsCard
                title="Avg Trade"
                value={formatCurrency(metrics.averageTrade)}
                changeType={metrics.averageTrade >= 0 ? 'positive' : 'negative'}
                icon={<TrendingUp className="h-5 w-5 text-[#4361EE]" />}
              />
              <MetricsCard
                title="Profit Factor"
                value={metrics.profitFactor.toFixed(2)}
                change={metrics.profitFactor >= 1.5 ? 'Excellent' : metrics.profitFactor >= 1 ? 'Good' : 'Needs Work'}
                changeType={metrics.profitFactor >= 1.5 ? 'positive' : metrics.profitFactor >= 1 ? 'neutral' : 'negative'}
                icon={<Zap className="h-5 w-5 text-amber-400" />}
              />
              <MetricsCard
                title="Best Pair"
                value={metrics.bestPerformingPair}
                icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Equity Curve */}
              <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4361EE] rounded-full" />
                    Equity Curve
                  </h3>
                  <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                    {filteredTrades.length} data pts
                  </span>
                </div>
                <div className="h-64">
                  <EquityCurveChart trades={filteredTrades} />
                </div>
              </div>

              {/* Win/Loss Distribution */}
              <WinLossChart trades={filteredTrades} />
            </div>

            {/* Pair Performance — Pro */}
            <PremiumFeatureWrapper
              featureType="analytics"
              title="Discover Your Most Profitable Pairs"
              description="See which trading pairs make you the most money and focus your efforts where they count"
            >
              <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    Performance by Pair
                  </h3>
                  <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                    Performance breakdown
                  </span>
                </div>
                <div className="h-64">
                  <PairPerformanceChart trades={filteredTrades} />
                </div>
              </div>
            </PremiumFeatureWrapper>

            {/* Setup Performance — Pro */}
            {filteredTrades.length > 0 && (
              <PremiumFeatureWrapper
                featureType="analytics"
                title="Find Your Winning Strategies"
                description="Identify which trading setups generate the most profit and replicate your success"
              >
                <div className="space-y-5">
                  {/* Header */}
                  <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#DDE4F0]">
                        Setup Performance Analytics
                      </h2>
                      <p className="text-[#4A5880] mt-0.5 text-xs uppercase tracking-widest">
                        Strategy Insights • Profitability Analysis
                      </p>
                    </div>
                    <span className="text-[10px] text-[#4A5880] font-mono">
                      {calculateSetupPerformance(filteredTrades).length} active setups
                    </span>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#4361EE] rounded-full" />
                          Win Rate by Setup
                        </h3>
                        <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                          Success rate
                        </span>
                      </div>
                      <div className="h-64">
                        <SetupPerformanceChart
                          data={calculateSetupPerformance(filteredTrades)}
                          title="Win Rate"
                          dataKey="winRate"
                          yAxisFormatter={(value) => `${Number(value).toFixed(0)}%`}
                        />
                      </div>
                    </div>

                    <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          P&L by Setup
                        </h3>
                        <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                          Profitability
                        </span>
                      </div>
                      <div className="h-64">
                        <SetupPerformanceChart
                          data={calculateSetupPerformance(filteredTrades)}
                          title="Total P&L"
                          dataKey="totalPnL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        Setup Performance Summary
                      </h3>
                      <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                        Detailed metrics
                      </span>
                    </div>
                    <SetupPerformanceTable data={calculateSetupPerformance(filteredTrades)} />
                  </div>
                </div>
              </PremiumFeatureWrapper>
            )}

            {/* Recent Trades */}
            {filteredTrades.length > 0 ? (
              <div className="bg-[#131826] border border-[#1A2540] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A2540]">
                  <h3 className="text-sm font-semibold text-[#DDE4F0] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    Recent Trades
                  </h3>
                  <span className="text-[10px] text-[#4A5880] font-mono uppercase tracking-wider">
                    Last 5 trades
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-[#1A2540] bg-[#0D1121]">
                        {['Date', 'Pair', 'Direction', 'Entry', 'P&L', 'Setup'].map((label) => (
                          <th
                            key={label}
                            className="px-4 py-3 text-left text-[10px] font-medium text-[#4A5880] uppercase tracking-wider"
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A2540]">
                      {filteredTrades.slice(0, 5).map((trade) => (
                        <tr key={trade.id} className="hover:bg-[#4361EE]/5 transition-colors duration-150">
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0] font-mono">
                            {new Date(trade.trade_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs font-semibold text-[#DDE4F0]">
                            {trade.pair}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={cn(
                              'inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border',
                              trade.direction === 'long'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            )}>
                              {trade.direction.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0] font-mono">
                            ${trade.entry_price.toFixed(2)}
                          </td>
                          <td className={cn(
                            'px-4 py-3.5 whitespace-nowrap text-xs font-bold font-mono',
                            getPnLColor(trade.pnl)
                          )}>
                            {formatCurrency(trade.pnl)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#4A5880]">
                            {trade.setup_tag || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#131826] border border-[#1A2540] rounded-xl px-6 py-14 flex flex-col items-center text-center gap-4">
                <TrendingUp className="h-8 w-8 text-[#4A5880] opacity-50" />
                <div>
                  <p className="text-sm font-medium text-[#DDE4F0] mb-1">No trades found</p>
                  <p className="text-xs text-[#4A5880]">
                    {hasActiveFilters ? 'Try adjusting your filters' : 'Add your first trade to get started'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm text-[#7B8BB0] hover:text-[#DDE4F0] border border-[#1A2540] hover:border-[#4361EE]/30 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <a
                    href="/dashboard/trades"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4361EE] hover:bg-[#3451D1] text-white text-sm font-medium rounded-lg transition-colors min-h-11"
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
