'use client'

import { Calendar, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TradeDirection } from '@/types/trade'
import { TradeFilterState } from '@/hooks/useTradeFilters'

interface ReusableTradeFiltersProps {
  className?: string
  trades: any[]
  // Controlled component props - single source of truth from parent
  filters: TradeFilterState
  filterOptions: {
    pairs: string[]
    setupTags: string[]
  }
  updateFilter: (key: keyof TradeFilterState, value: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

/* Reusable styled select wrapper — keeps native <select> for logic compatibility */
function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <label className="text-xs uppercase tracking-wider text-[#4A5880] mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={cn(
            "w-full appearance-none bg-[#0A0C16] border border-[#1E2844] text-[#DDE4F0]",
            "rounded-lg px-4 py-2.5 pr-10 text-sm",
            "hover:border-[#4361EE]/40",
            "focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/25 focus:outline-none",
            "transition-all duration-200",
            "[&>option]:bg-[#131826] [&>option]:text-[#DDE4F0]"
          )}
        >
          {children}
        </select>
        {/* Custom dropdown chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4A5880]"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/* Reusable styled date input wrapper */
function FilterDate({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col">
      <label className="text-xs uppercase tracking-wider text-[#4A5880] mb-1.5 font-medium">
        {label}
      </label>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4A5880]" />
        <input
          type="date"
          value={value}
          onChange={onChange}
          className={cn(
            "w-full bg-[#0A0C16] border border-[#1E2844] text-[#DDE4F0]",
            "rounded-lg pl-9 pr-4 py-2.5 text-sm",
            "hover:border-[#4361EE]/40",
            "focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/25 focus:outline-none",
            "transition-all duration-200",
            "scheme-dark"
          )}
        />
      </div>
    </div>
  )
}

export function ReusableTradeFilters({
  className,
  trades: _trades,
  filters,
  filterOptions,
  updateFilter,
  clearFilters,
  hasActiveFilters,
}: ReusableTradeFiltersProps) {
  const handleFilterChange = (key: keyof TradeFilterState, value: string) => {
    updateFilter(key, value)
  }

  return (
    <div
      className={cn(
        "bg-[#131826] border border-[#1A2540] rounded-xl p-5",
        "hover:border-[#4361EE]/25 transition-colors duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#4361EE]/10 rounded-md">
            <Filter className="h-3.5 w-3.5 text-[#4361EE]" />
          </div>
          <span className="text-sm font-semibold text-[#DDE4F0]">Trade Filters</span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#4361EE]/15 text-[#4361EE] border border-[#4361EE]/25 rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg",
              "border border-[#1E2844] text-[#7B8BB0]",
              "hover:border-[#4361EE]/40 hover:text-[#DDE4F0]",
              "transition-all duration-200"
            )}
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

        {/* Pair */}
        <FilterSelect
          label="Pair"
          value={filters.pair}
          onChange={(e) => handleFilterChange('pair', e.target.value)}
        >
          <option value="all">All Pairs</option>
          {filterOptions.pairs.map(pair => (
            <option key={pair} value={pair}>{pair}</option>
          ))}
        </FilterSelect>

        {/* Setup Tag */}
        <FilterSelect
          label="Setup Tag"
          value={filters.setupTag}
          onChange={(e) => handleFilterChange('setupTag', e.target.value)}
        >
          <option value="all">All Setups</option>
          {filterOptions.setupTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </FilterSelect>

        {/* Direction */}
        <FilterSelect
          label="Direction"
          value={filters.direction}
          onChange={(e) => handleFilterChange('direction', e.target.value as TradeDirection | 'all')}
        >
          <option value="all">All Directions</option>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </FilterSelect>

        {/* Result Type */}
        <FilterSelect
          label="Result Type"
          value={filters.resultType}
          onChange={(e) => handleFilterChange('resultType', e.target.value)}
        >
          <option value="all">All Results</option>
          <option value="wins">Wins Only</option>
          <option value="losses">Losses Only</option>
        </FilterSelect>

        {/* Date From */}
        <FilterDate
          label="From Date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />

        {/* Date To */}
        <FilterDate
          label="To Date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />
      </div>

      {/* Active filter status bar */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-[#4361EE]/8 border border-[#4361EE]/20 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4361EE] animate-pulse" />
          <p className="text-xs text-[#4361EE]">Filtered results active</p>
        </div>
      )}
    </div>
  )
}
