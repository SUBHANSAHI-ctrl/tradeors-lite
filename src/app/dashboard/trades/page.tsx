'use client'

import { useState } from 'react'
import { useTrades } from '@/hooks/useTrades'
import { useTradeFilters } from '@/hooks/useTradeFilters'
import { useUserProfile } from '@/hooks/useUserProfile'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TradeForm } from '@/components/trades/TradeForm'
import { ReusableTradeFilters } from '@/components/trades/ReusableTradeFilters'
import { TradeCreationButton } from '@/components/trades/TradeCreationButton'
import { formatCurrency, getPnLColor } from '@/lib/utils'
import { Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react'
import { Trade, TradeFormData } from '@/types/trade'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { cn } from '@/lib/utils'

export default function TradesPage() {
  const { trades, loading, addTrade, updateTrade, deleteTrade } = useTrades()
  const { filters, filterOptions, filteredTrades, updateFilter, clearFilters, hasActiveFilters } = useTradeFilters(trades)
  const { profile, loading: profileLoading } = useUserProfile()
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return
    try {
      await deleteTrade(id)
    } catch (error) {
      console.error('Failed to delete trade:', error)
    }
  }

  const handleSubmit = async (data: TradeFormData) => {
    try {
      if (editingTrade) {
        await updateTrade(editingTrade.id, data)
      } else {
        await addTrade(data)
      }
      setShowForm(false)
      setEditingTrade(null)
    } catch (error) {
      console.error('Failed to save trade:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save trade'
      alert(`Error: ${errorMessage}`)
      throw error
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTrade(null)
  }

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-[#4A5880] text-sm">Loading trades…</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#DDE4F0] tracking-tight">
              Your Trades
            </h1>
            <TradeCreationButton
              onClick={() => setShowForm(true)}
              trades={trades}
              profile={profile}
              profileLoading={profileLoading}
            />
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

          {/* ── Trade form modal ───────────────────────────── */}
          {showForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCancel}
              />
              {/* Dialog */}
              <div className="flex items-start justify-center min-h-screen px-4 py-8 sm:py-12">
                <div className="relative bg-[#131826] border border-[#1A2540] rounded-xl w-full max-w-3xl shadow-2xl">
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2540]">
                    <h2 className="text-base font-semibold text-[#DDE4F0]">
                      {editingTrade ? 'Edit Trade' : 'Add New Trade'}
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="p-1.5 rounded-lg text-[#4A5880] hover:text-[#DDE4F0] hover:bg-[#4361EE]/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="p-6">
                    <TradeForm
                      initialData={editingTrade ? {
                        pair:        editingTrade.pair,
                        direction:   editingTrade.direction,
                        entry_price: editingTrade.entry_price,
                        stop_loss:   editingTrade.stop_loss,
                        take_profit: editingTrade.take_profit,
                        pnl:         editingTrade.pnl,
                        setup_tag:   editingTrade.setup_tag,
                        notes:       editingTrade.notes,
                        trade_date:  editingTrade.trade_date,
                      } : undefined}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      submitLabel={editingTrade ? 'Update Trade' : 'Add Trade'}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Trades table / empty state ─────────────────── */}
          {filteredTrades.length === 0 ? (
            <div className="bg-[#131826] border border-[#1A2540] rounded-xl px-6 py-14 flex flex-col items-center text-center gap-4">
              <p className="text-[#4A5880] text-sm">No trades found</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#4361EE] hover:bg-[#3451D1] text-white text-sm font-medium rounded-lg transition-colors min-h-11"
              >
                Add Your First Trade
              </button>
            </div>
          ) : (
            <div className="bg-[#131826] border border-[#1A2540] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-[#1A2540] bg-[#0D1121]">
                      {[
                        { label: 'Date',        cls: '' },
                        { label: 'Pair',        cls: '' },
                        { label: 'SS',          cls: 'hidden sm:table-cell' },
                        { label: 'Direction',   cls: '' },
                        { label: 'Entry',       cls: 'hidden md:table-cell' },
                        { label: 'SL',          cls: 'hidden lg:table-cell' },
                        { label: 'TP',          cls: 'hidden lg:table-cell' },
                        { label: 'P&L',         cls: '' },
                        { label: 'Setup',       cls: 'hidden sm:table-cell' },
                        { label: 'Actions',     cls: '' },
                      ].map(({ label, cls }) => (
                        <th
                          key={label}
                          className={cn(
                            'px-3 sm:px-5 py-3 text-left text-[10px] font-medium text-[#4A5880] uppercase tracking-wider',
                            cls
                          )}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2540]">
                    {filteredTrades.map((trade) => (
                      <tr
                        key={trade.id}
                        className="hover:bg-[#4361EE]/5 transition-colors duration-150"
                      >
                        {/* Date */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0]">
                          {new Date(trade.trade_date).toLocaleDateString()}
                        </td>
                        {/* Pair */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-[#DDE4F0]">
                          {trade.pair}
                        </td>
                        {/* Screenshot */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap hidden sm:table-cell">
                          {trade.screenshot_url ? (
                            <button
                              onClick={() => window.open(trade.screenshot_url!, '_blank')}
                              title="View screenshot"
                              className="w-7 h-7 bg-[#4361EE]/10 border border-[#4361EE]/20 rounded-md flex items-center justify-center hover:bg-[#4361EE]/20 transition-colors"
                            >
                              <ImageIcon className="h-3.5 w-3.5 text-[#4361EE]" />
                            </button>
                          ) : (
                            <div className="w-7 h-7 bg-[#0D1121] border border-[#1A2540] rounded-md flex items-center justify-center opacity-40">
                              <ImageIcon className="h-3.5 w-3.5 text-[#4A5880]" />
                            </div>
                          )}
                        </td>
                        {/* Direction */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border',
                            trade.direction === 'long'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          )}>
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        {/* Entry */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0] hidden md:table-cell font-mono">
                          ${trade.entry_price.toFixed(2)}
                        </td>
                        {/* Stop Loss */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0] hidden lg:table-cell font-mono">
                          ${trade.stop_loss.toFixed(2)}
                        </td>
                        {/* Take Profit */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs text-[#7B8BB0] hidden lg:table-cell font-mono">
                          ${trade.take_profit.toFixed(2)}
                        </td>
                        {/* P&L */}
                        <td className={cn(
                          'px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs font-bold font-mono',
                          getPnLColor(trade.pnl)
                        )}>
                          {formatCurrency(trade.pnl)}
                        </td>
                        {/* Setup */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap text-xs text-[#4A5880] hidden sm:table-cell">
                          {trade.setup_tag || '—'}
                        </td>
                        {/* Actions */}
                        <td className="px-3 sm:px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleEdit(trade)}
                              title="Edit trade"
                              className="p-1.5 rounded-md text-[#4A5880] hover:text-[#4361EE] hover:bg-[#4361EE]/10 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(trade.id)}
                              title="Delete trade"
                              className="p-1.5 rounded-md text-[#4A5880] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
