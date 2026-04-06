// Behavioral insights engine for analyzing user trading patterns
// This module provides behavioral analysis to help users understand their trading habits

import { Trade } from '@/types/trade'

// Types for behavioral insights - core high-impact insights only
export interface Insight {
  type: 'overtrading' | 'loss_streak' | 'best_pair'
  message: string
  severity?: 'low' | 'medium' | 'high'
  data?: any
}

interface TradeGroup {
  date: string
  trades: Trade[]
  count: number
}

interface LossStreak {
  startIndex: number
  length: number
  totalLoss: number
}

interface PairPerformance {
  pair: string
  totalPnL: number
  winRate: number
  tradeCount: number
  avgPnL: number
}

// Constants for behavioral analysis
const OVERTRADING_THRESHOLD = 5 // trades per day
const LOSS_STREAK_THRESHOLD = 3 // consecutive losses

/**
 * Detects overtrading patterns by analyzing daily trade frequency
 * @param trades - Array of user trades
 * @returns Insight if overtrading detected, null otherwise
 */
export function detectOvertrading(trades: Trade[]): Insight | null {
  if (!trades || trades.length === 0) {
    return null
  }

  // Group trades by date
  const tradesByDate: Record<string, Trade[]> = {}
  
  trades.forEach(trade => {
    const date = new Date(trade.trade_date).toISOString().split('T')[0]
    if (!tradesByDate[date]) {
      tradesByDate[date] = []
    }
    tradesByDate[date].push(trade)
  })

  // Find days with excessive trading
  const overtradingDays: TradeGroup[] = []
  
  Object.entries(tradesByDate).forEach(([date, dayTrades]) => {
    if (dayTrades.length > OVERTRADING_THRESHOLD) {
      overtradingDays.push({
        date,
        trades: dayTrades,
        count: dayTrades.length
      })
    }
  })

  if (overtradingDays.length === 0) {
    return null
  }

  // Find the worst overtrading day
  const worstDay = overtradingDays.reduce((prev, current) => 
    current.count > prev.count ? current : prev
  )

  return {
    type: 'overtrading',
    message: `You tend to overtrade on certain days, which may impact performance. Your busiest day had ${worstDay.count} trades.`,
    severity: worstDay.count > 8 ? 'high' : worstDay.count > 6 ? 'medium' : 'low',
    data: {
      overtradingDays: overtradingDays.length,
      worstDay: worstDay,
      threshold: OVERTRADING_THRESHOLD
    }
  }
}

/**
 * Detects loss streaks by finding consecutive losing trades
 * @param trades - Array of user trades
 * @returns Insight if loss streak detected, null otherwise
 */
export function detectLossStreak(trades: Trade[]): Insight | null {
  if (!trades || trades.length === 0) {
    return null
  }

  // Sort trades by date to ensure chronological order
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
  )

  const lossStreaks: LossStreak[] = []
  let currentStreak: LossStreak | null = null

  sortedTrades.forEach((trade, index) => {
    if (trade.pnl < 0) {
      // This is a losing trade
      if (currentStreak === null) {
        currentStreak = {
          startIndex: index,
          length: 1,
          totalLoss: trade.pnl
        }
      } else {
        currentStreak.length++
        currentStreak.totalLoss += trade.pnl
      }
    } else {
      // This is a winning trade - end current streak if exists
      if (currentStreak !== null && currentStreak.length >= LOSS_STREAK_THRESHOLD) {
        lossStreaks.push(currentStreak)
      }
      currentStreak = null
    }
  })

  // Check if the last trades form a streak - handle null case explicitly
  const handleFinalStreak = () => {
    if (currentStreak === null) return
    
    const finalStreakData = currentStreak as LossStreak
    if (finalStreakData.length >= LOSS_STREAK_THRESHOLD) {
      lossStreaks.push(finalStreakData)
    }
  }
  
  handleFinalStreak()

  if (lossStreaks.length === 0) {
    return null
  }

  // Find the longest streak with explicit typing and initial value
  const longestStreak = lossStreaks.reduce<LossStreak>((prev, current) => 
    current.length > prev.length ? current : prev, lossStreaks[0]
  )

  return {
    type: 'loss_streak',
    message: `You experience loss streaks after consecutive losses. Your longest streak was ${longestStreak.length} trades with a total loss of ${Math.abs(longestStreak.totalLoss).toFixed(2)}.`,
    severity: longestStreak.length > 5 ? 'high' : longestStreak.length > 3 ? 'medium' : 'low',
    data: {
      streaksDetected: lossStreaks.length,
      longestStreak: longestStreak,
      threshold: LOSS_STREAK_THRESHOLD
    }
  }
}

/**
 * Identifies the best performing trading pair
 * @param trades - Array of user trades
 * @returns Insight with best performing pair information
 */
export function detectBestPair(trades: Trade[]): Insight | null {
  if (!trades || trades.length === 0) {
    return null
  }

  // Group trades by pair and calculate performance
  const pairPerformance: Record<string, PairPerformance> = {}

  trades.forEach(trade => {
    if (!pairPerformance[trade.pair]) {
      pairPerformance[trade.pair] = {
        pair: trade.pair,
        totalPnL: 0,
        winRate: 0,
        tradeCount: 0,
        avgPnL: 0
      }
    }

    const performance = pairPerformance[trade.pair]
    performance.totalPnL += trade.pnl
    performance.tradeCount++
    
    if (trade.pnl > 0) {
      performance.winRate++
    }
  })

  // Calculate win rates and average PnL
  Object.values(pairPerformance).forEach(performance => {
    performance.winRate = (performance.winRate / performance.tradeCount) * 100
    performance.avgPnL = performance.totalPnL / performance.tradeCount
  })

  // Find the best performing pair (by total PnL)
  const bestPair = Object.values(pairPerformance).reduce((prev, current) => 
    current.totalPnL > prev.totalPnL ? current : prev
  )

  if (bestPair.totalPnL <= 0) {
    return null // Don't recommend pairs that are losing money
  }

  return {
    type: 'best_pair',
    message: `${bestPair.pair} is your most profitable pair with ${bestPair.tradeCount} trades and ${bestPair.totalPnL.toFixed(2)} total profit.`,
    severity: bestPair.winRate > 60 ? 'high' : bestPair.winRate > 50 ? 'medium' : 'low',
    data: bestPair
  }
}


/**
 * Main function to generate all behavioral insights
 * @param trades - Array of user trades
 * @returns Array of insights
 */
export function generateInsights(trades: Trade[]): Insight[] {
  if (!trades || trades.length === 0) {
    return []
  }

  const insights: Insight[] = []

  // Detect overtrading
  const overtradingInsight = detectOvertrading(trades)
  if (overtradingInsight) {
    insights.push(overtradingInsight)
  }

  // Detect loss streaks
  const lossStreakInsight = detectLossStreak(trades)
  if (lossStreakInsight) {
    insights.push(lossStreakInsight)
  }

  // Detect best performing pair
  const bestPairInsight = detectBestPair(trades)
  if (bestPairInsight) {
    insights.push(bestPairInsight)
  }


  return insights
}

/**
 * Helper function to get insights summary
 * @param trades - Array of user trades
 * @returns Object with insights count and summary
 */
export function getInsightsSummary(trades: Trade[]): {
  insights: Insight[]
  count: number
  hasCriticalIssues: boolean
} {
  const insights = generateInsights(trades)
  
  const hasCriticalIssues = insights.some(insight => 
    insight.severity === 'high'
  )

  return {
    insights,
    count: insights.length,
    hasCriticalIssues
  }
}

/**
 * Format insights for display in UI
 * @param insights - Array of insights
 * @returns Formatted insights array ready for display
 */
export function formatInsightsForDisplay(insights: Insight[]): {
  insights: Insight[]
  categories: {
    overtrading: Insight[]
    loss_streak: Insight[]
    best_pair: Insight[]
  }
} {
  const categories = {
    overtrading: insights.filter(i => i.type === 'overtrading'),
    loss_streak: insights.filter(i => i.type === 'loss_streak'),
    best_pair: insights.filter(i => i.type === 'best_pair')
  }

  return {
    insights,
    categories
  }
}
