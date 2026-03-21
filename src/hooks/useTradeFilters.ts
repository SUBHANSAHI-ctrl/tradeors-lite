import { useState, useEffect, useMemo } from 'react'
import { Trade, TradeDirection } from '@/types/trade'

export interface TradeFilterState {
  pair: string
  setupTag: string
  direction: TradeDirection | 'all'
  resultType: 'all' | 'wins' | 'losses'
  dateFrom: string
  dateTo: string
}

export const DEFAULT_FILTERS: TradeFilterState = {
  pair: 'all',
  setupTag: 'all',
  direction: 'all',
  resultType: 'all',
  dateFrom: '',
  dateTo: '',
}

export interface FilterOptions {
  pairs: string[]
  setupTags: string[]
}

export function useTradeFilters(trades: Trade[]) {
  const [filters, setFilters] = useState<TradeFilterState>(DEFAULT_FILTERS)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ pairs: [], setupTags: [] })

  // Generate filter options from trades
  useEffect(() => {
    const pairs = Array.from(new Set(trades.map((trade: Trade) => trade.pair))).sort()
    const setupTags = Array.from(new Set(trades.map((trade: Trade) => trade.setup_tag))).sort()
    
    setFilterOptions({ pairs, setupTags })
  }, [trades])

  // Apply filters to trades
  const filteredTrades = useMemo(() => {
    if (!trades || trades.length === 0) return []

    let filtered = [...trades]

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

    return filtered
  }, [trades, filters])

  const updateFilter = (key: keyof TradeFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'dateFrom' || key === 'dateTo') return value !== ''
    return value !== 'all'
  })

  return {
    filters,
    filterOptions,
    filteredTrades,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  }
}