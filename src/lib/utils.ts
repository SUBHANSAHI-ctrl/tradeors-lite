import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Trade, PerformanceMetrics, PairPerformance } from '@/types/trade'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

export function getPnLColor(pnl: number): string {
  return pnl >= 0 ? 'text-green-400' : 'text-red-400'
}

export function getPnLBackground(pnl: number): string {
  return pnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
}

export function calculatePerformanceMetrics(trades: Trade[]): PerformanceMetrics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalPnL: 0,
      averageTrade: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      bestPerformingPair: '-',
      worstPerformingPair: '-',
    }
  }

  const wins = trades.filter(trade => trade.pnl > 0).length
  const losses = trades.filter(trade => trade.pnl < 0).length
  const winRate = (wins / trades.length) * 100
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  
  const winningTrades = trades.filter(trade => trade.pnl > 0)
  const losingTrades = trades.filter(trade => trade.pnl < 0)
  
  const averageWin = winningTrades.length > 0 
    ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length 
    : 0
    
  const averageLoss = losingTrades.length > 0 
    ? losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length 
    : 0
    
  const averageTrade = totalPnL / trades.length
  
  const profitFactor = averageLoss !== 0 ? Math.abs(averageWin / averageLoss) : 0

  // Calculate best and worst performing pairs
  const pairPerformance = calculatePairPerformance(trades)
  const bestPair = pairPerformance.reduce((best, current) => 
    current.totalPnL > best.totalPnL ? current : best
  , pairPerformance[0])
  
  const worstPair = pairPerformance.reduce((worst, current) => 
    current.totalPnL < worst.totalPnL ? current : worst
  , pairPerformance[0])

  return {
    totalTrades: trades.length,
    wins,
    losses,
    winRate,
    totalPnL,
    averageTrade,
    averageWin,
    averageLoss,
    profitFactor,
    bestPerformingPair: bestPair?.pair || '-',
    worstPerformingPair: worstPair?.pair || '-',
  }
}

export function calculatePairPerformance(trades: Trade[]): PairPerformance[] {
  const pairMap = new Map<string, Trade[]>()
  
  trades.forEach(trade => {
    if (!pairMap.has(trade.pair)) {
      pairMap.set(trade.pair, [])
    }
    pairMap.get(trade.pair)!.push(trade)
  })
  
  return Array.from(pairMap.entries()).map(([pair, pairTrades]) => {
    const wins = pairTrades.filter(trade => trade.pnl > 0).length
    const losses = pairTrades.filter(trade => trade.pnl < 0).length
    const totalPnL = pairTrades.reduce((sum, trade) => sum + trade.pnl, 0)
    const averagePnL = totalPnL / pairTrades.length
    
    return {
      pair,
      trades: pairTrades.length,
      wins,
      losses,
      winRate: (wins / pairTrades.length) * 100,
      totalPnL,
      averagePnL,
    }
  })
}

export function generateEquityCurve(trades: Trade[]): { date: string; equity: number }[] {
  if (trades.length === 0) return []
  
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
  )
  
  let runningPnL = 0
  return sortedTrades.map(trade => {
    runningPnL += trade.pnl
    return {
      date: trade.trade_date,
      equity: runningPnL,
    }
  })
}

export interface SetupPerformance {
  setup: string
  trades: number
  wins: number
  losses: number
  winRate: number
  totalPnL: number
  averagePnL: number
}

export function calculateSetupPerformance(trades: Trade[]): SetupPerformance[] {
  const setupMap = new Map<string, Trade[]>()
  
  trades.forEach(trade => {
    const setup = trade.setup_tag || 'No Setup'
    if (!setupMap.has(setup)) {
      setupMap.set(setup, [])
    }
    setupMap.get(setup)!.push(trade)
  })
  
  return Array.from(setupMap.entries()).map(([setup, setupTrades]) => {
    const wins = setupTrades.filter(trade => trade.pnl > 0).length
    const losses = setupTrades.filter(trade => trade.pnl < 0).length
    const totalPnL = setupTrades.reduce((sum, trade) => sum + trade.pnl, 0)
    const averagePnL = totalPnL / setupTrades.length
    const winRate = (wins / setupTrades.length) * 100
    
    return {
      setup,
      trades: setupTrades.length,
      wins,
      losses,
      winRate,
      totalPnL,
      averagePnL,
    }
  }).sort((a, b) => b.totalPnL - a.totalPnL) // Sort by total PnL descending
}
