'use client'

import { useState } from 'react'
import { useTrades } from '@/hooks/useTrades'
import { useTradeFilters } from '@/hooks/useTradeFilters'
import { useUserProfile } from '@/hooks/useUserProfile'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TradeForm } from '@/components/trades/TradeForm'
import { ReusableTradeFilters } from '@/components/trades/ReusableTradeFilters'
import { TradeCreationButton } from '@/components/trades/TradeCreationButton'
import { formatCurrency, getPnLColor, getPnLBackground } from '@/lib/utils'
import { Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import { Trade, TradeFormData } from '@/types/trade'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { canCreateTrade } from '@/config/planLimits'

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
    if (confirm('Are you sure you want to delete this trade?')) {
      try {
        await deleteTrade(id)
      } catch (error) {
        console.error('Failed to delete trade:', error)
      }
    }
  }

  const handleSubmit = async (data: TradeFormData) => {
    try {
      if (editingTrade) {
        // Update existing trade
        await updateTrade(editingTrade.id, data)
      } else {
        // Add new trade
        await addTrade(data)
      }
      setShowForm(false)
      setEditingTrade(null)
    } catch (error) {
      console.error('Failed to save trade:', error)
      // Show user-friendly error message
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
            <div className="text-gray-400">Loading trades...</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Header - Improved responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Your Trades</h1>
           <TradeCreationButton 
             onClick={() => setShowForm(true)}
             trades={trades}
             profile={profile}
             profileLoading={profileLoading}
           />
        </div>

        {/* Trade Filters - Controlled component with single source of truth */}
        <ReusableTradeFilters 
          trades={trades}
          filters={filters}
          filterOptions={filterOptions}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Trade Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50" onClick={handleCancel} />
              <div className="relative bg-gray-800 rounded-lg max-w-4xl w-full p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">
                  {editingTrade ? 'Edit Trade' : 'Add New Trade'}
                </h2>
                <TradeForm
                  initialData={editingTrade ? {
                    pair: editingTrade.pair,
                    direction: editingTrade.direction,
                    entry_price: editingTrade.entry_price,
                    stop_loss: editingTrade.stop_loss,
                    take_profit: editingTrade.take_profit,
                    pnl: editingTrade.pnl,
                    setup_tag: editingTrade.setup_tag,
                    notes: editingTrade.notes,
                    trade_date: editingTrade.trade_date,
                  } : undefined}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  submitLabel={editingTrade ? 'Update Trade' : 'Add Trade'}
                />
              </div>
            </div>
          </div>
        )}

        {/* Trades Table */}
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No trades found</div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Add Your First Trade
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pair
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Screenshot
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Direction
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Entry
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Stop Loss
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      Take Profit
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Setup
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-700/50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                        {new Date(trade.trade_date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                        {trade.pair}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                        {trade.screenshot_url ? (
                          <button
                            onClick={() => window.open(trade.screenshot_url!, '_blank')}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View screenshot"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600">
                              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          </button>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-md flex items-center justify-center opacity-50">
                            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade.direction === 'long' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden md:table-cell">
                        ${trade.entry_price.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden lg:table-cell">
                        ${trade.stop_loss.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden lg:table-cell">
                        ${trade.take_profit.toFixed(2)}
                      </td>
                      <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium ${getPnLColor(trade.pnl)}`}>
                        {formatCurrency(trade.pnl)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden sm:table-cell">
                        {trade.setup_tag}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleEdit(trade)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Edit trade"
                          >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(trade.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete trade"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
