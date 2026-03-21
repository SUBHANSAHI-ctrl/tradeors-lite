'use client'

import { useState, useEffect } from 'react'
import { Trade, TradeDirection } from '@/types/trade'
import { Calendar, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TradeFiltersProps {
  trades: Trade[]
  onFilterChange: (filteredTrades: Trade[]) => void
  className?: string
}

interface FilterState {
  pair: string
  setupTag: string
  direction: TradeDirection | 'all'
  resultType: 'all' | 'wins' | 'losses'
  dateFrom: string
  dateTo: string
}

export function TradeFilters({ trades, onFilterChange, className }: TradeFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    pair: 'all',
    setupTag: 'all',
    direction: 'all',
    resultType: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const [availablePairs, setAvailablePairs] = useState<string[]>([])
  const [availableSetupTags, setAvailableSetupTags] = useState<string[]>([])

  // Generate filter options from existing trades
  useEffect(() => {
    const pairs = Array.from(new Set(trades.map((trade: Trade) => trade.pair))).sort()
    const setupTags = Array.from(new Set(trades.map((trade: Trade) => trade.setup_tag))).sort()
    
    setAvailablePairs(pairs)
    setAvailableSetupTags(setupTags)
  }, [trades])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let filtered = trades

    // Filter by pair
    if (filters.pair !== 'all') {
      filtered = filtered.filter((trade: Trade) => trade.pair === filters.pair)
    }

    // Filter by setup tag
    if (filters.setupTag !== 'all') {
      filtered = filtered.filter((trade: Trade) => trade.setup_tag === filters.setupTag)
    }

    // Filter by direction
    if (filters.direction !== 'all') {
      filtered = filtered.filter((trade: Trade) => trade.direction === filters.direction)
    }

    // Filter by result type (wins/losses)
    if (filters.resultType !== 'all') {
      if (filters.resultType === 'wins') {
        filtered = filtered.filter((trade: Trade) => trade.pnl > 0)
      } else if (filters.resultType === 'losses') {
        filtered = filtered.filter((trade: Trade) => trade.pnl <= 0)
      }
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((trade: Trade) => new Date(trade.trade_date) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter((trade: Trade) => new Date(trade.trade_date) <= new Date(filters.dateTo))
    }

    onFilterChange(filtered)
  }, [filters, trades, onFilterChange])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      pair: 'all',
      setupTag: 'all',
      direction: 'all',
      resultType: 'all',
      dateFrom: '',
      dateTo: '',
    })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'dateFrom' || key === 'dateTo') return value !== ''
    return value !== 'all'
  })

  return (
    <div className={cn("glass rounded-lg p-6 border border-white/10", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Trade Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Pair Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pair
          </label>
          <select
            value={filters.pair}
            onChange={(e) => handleFilterChange('pair', e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Pairs</option>
            {availablePairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>

        {/* Setup Tag Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Setup Tag
          </label>
          <select
            value={filters.setupTag}
            onChange={(e) => handleFilterChange('setupTag', e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Setups</option>
            {availableSetupTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Direction Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Direction
          </label>
          <select
            value={filters.direction}
            onChange={(e) => handleFilterChange('direction', e.target.value as TradeDirection | 'all')}
            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Directions</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        {/* Result Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Result Type
          </label>
          <select
            value={filters.resultType}
            onChange={(e) => handleFilterChange('resultType', e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">All Results</option>
            <option value="wins">Wins Only</option>
            <option value="losses">Losses Only</option>
          </select>
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Status */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <p className="text-sm text-blue-400">
            Active filters applied
          </p>
        </div>
      )}
    </div>
  )
}