import { Trade } from '@/types/trade'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GrowthLevel = 1 | 2 | 3 | 4 | 5

export const LEVEL_NAMES: Record<GrowthLevel, string> = {
  1: 'Seed',
  2: 'Sprout',
  3: 'Growing',
  4: 'Strong',
  5: 'Elite Trader',
}

export interface GrowthState {
  /** Consecutive days with at least one logged trade (allows 1-day gap for today) */
  streak: number
  /** 0–100: fraction of last 7 days that had at least one trade */
  consistency: number
  totalTrades: number
  /** 0–100 composite score: streak(40) + consistency(40) + volume(20) */
  compositeScore: number
  growthLevel: GrowthLevel
  /** 0–100 progress toward the next level (100 at Elite) */
  growthProgress: number
  message: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Consecutive-day streak counted backwards from the most recent trade date.
 *  We allow the most recent trade to be today OR yesterday (user may not have
 *  traded yet today but shouldn't lose their streak overnight). */
function calcStreak(trades: Trade[]): number {
  if (trades.length === 0) return 0

  const tradeDateSet = new Set(
    trades.map((t) => (t.trade_date as string).split('T')[0])
  )
  const sorted = [...tradeDateSet].sort((a, b) => b.localeCompare(a))

  const today = getToday()
  const mostRecent = new Date(sorted[0])
  mostRecent.setHours(0, 0, 0, 0)

  const daysSinceLast = Math.round(
    (today.getTime() - mostRecent.getTime()) / 86_400_000
  )

  // Streak broken if last trade was 2+ days ago
  if (daysSinceLast > 1) return 0

  // Walk backwards from the most recent trade date
  let streak = 0
  let cursor = new Date(mostRecent)

  for (const dateStr of sorted) {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)

    if (d.getTime() === cursor.getTime()) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else if (d.getTime() < cursor.getTime()) {
      break // gap found
    }
  }

  return streak
}

/** Fraction of the last 7 calendar days that had at least one trade (0–100). */
function calcConsistency(trades: Trade[]): number {
  if (trades.length === 0) return 0

  const tradeDateSet = new Set(
    trades.map((t) => (t.trade_date as string).split('T')[0])
  )

  const today = getToday()
  let activeDays = 0

  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (tradeDateSet.has(toDateStr(d))) activeDays++
  }

  return Math.round((activeDays / 7) * 100)
}

function pickMessage(
  streak: number,
  consistency: number,
  totalTrades: number
): string {
  if (totalTrades === 0) return 'Log your first trade to start growing.'
  if (streak === 0) return 'Log your next trade to keep growing.'
  if (streak >= 21) return "You're elite — consistency like this compounds over time."
  if (streak >= 14) return 'Incredible discipline. Very few traders get here.'
  if (streak >= 7) return "Strong streak — you're building real discipline."
  if (streak >= 3) return "You're on a streak — don't break it."
  if (consistency < 30) return 'Focus on daily consistency — even one trade counts.'
  return "You're building consistency — keep going."
}

// ── Main export ───────────────────────────────────────────────────────────────

export function getUserGrowthState(trades: Trade[]): GrowthState {
  const streak = calcStreak(trades)
  const consistency = calcConsistency(trades)
  const totalTrades = trades.length

  // Score components (total = 100)
  const streakScore = Math.min(streak * 2, 40)              // 40 pts  (streak ≥ 20)
  const consistencyScore = Math.round(consistency * 0.4)    // 40 pts  (7/7 days)
  const volumeScore = Math.min(Math.round((totalTrades / 50) * 20), 20) // 20 pts (50 trades)

  const compositeScore = Math.min(streakScore + consistencyScore + volumeScore, 100)

  // Level band (each band = 20 pts)
  const rawLevel = Math.floor(compositeScore / 20) + 1
  const growthLevel = Math.max(1, Math.min(rawLevel, 5)) as GrowthLevel

  // Progress within the current level's 20-pt band
  const levelMin = (growthLevel - 1) * 20
  const levelMax = growthLevel * 20
  const growthProgress =
    growthLevel === 5
      ? 100
      : Math.round(((compositeScore - levelMin) / (levelMax - levelMin)) * 100)

  const message = pickMessage(streak, consistency, totalTrades)

  return {
    streak,
    consistency,
    totalTrades,
    compositeScore,
    growthLevel,
    growthProgress,
    message,
  }
}
