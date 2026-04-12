import { Trade } from '@/types/trade'

// ── Types ────────────────────────────────────────────────────────────────────

export type BehaviorFlag =
  | 'overtrading'
  | 'losing_streak'
  | 'low_performance'
  | 'revenge_trading'
  | 'bad_rr'

export interface BehaviorInsight {
  flag: BehaviorFlag
  /** Whether this insight requires a Pro plan */
  isPro: boolean
  severity: 'warning' | 'danger'
}

// ── Config ───────────────────────────────────────────────────────────────────

const OVERTRADING_THRESHOLD   = 10   // trades in last 24h
const LOSING_STREAK_MIN       = 3    // consecutive losses
const LOW_WIN_RATE_THRESHOLD  = 0.40 // 40%
const LOW_WIN_RATE_MIN_SAMPLE = 10   // need at least N trades to flag
const REVENGE_WINDOW_MS       = 10 * 60 * 1000  // 10 minutes
const BAD_RR_THRESHOLD        = 1.5
const BAD_RR_MIN_SAMPLE       = 5

/** Ordered from highest → lowest priority */
const PRIORITY_ORDER: BehaviorFlag[] = [
  'revenge_trading',
  'losing_streak',
  'overtrading',
  'low_performance',
  'bad_rr',
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function sortByCreatedAt(trades: Trade[]): Trade[] {
  return [...trades].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}

// ── Core engine ──────────────────────────────────────────────────────────────

/**
 * Analyzes a trade array and returns an array of BehaviorInsights sorted by
 * priority.  All computation is client-side; nothing is stored or transmitted.
 */
export function analyzeTradingBehavior(trades: Trade[]): BehaviorInsight[] {
  if (trades.length === 0) return []

  const sorted = sortByCreatedAt(trades)
  const now    = Date.now()
  const found: BehaviorInsight[] = []

  // ── 1. Overtrading (FREE) ─────────────────────────────
  const last24h = sorted.filter(
    t => now - new Date(t.created_at).getTime() < 24 * 60 * 60 * 1000
  )
  if (last24h.length > OVERTRADING_THRESHOLD) {
    found.push({ flag: 'overtrading', isPro: false, severity: 'warning' })
  }

  // ── 2. Losing streak (FREE) ───────────────────────────
  // Walk backwards from the most recent trade
  let streak = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].pnl < 0) streak++
    else break
  }
  if (streak >= LOSING_STREAK_MIN) {
    found.push({ flag: 'losing_streak', isPro: false, severity: 'danger' })
  }

  // ── 3. Low win rate (FREE) ────────────────────────────
  if (trades.length >= LOW_WIN_RATE_MIN_SAMPLE) {
    const wins    = trades.filter(t => t.pnl > 0).length
    const winRate = wins / trades.length
    if (winRate < LOW_WIN_RATE_THRESHOLD) {
      found.push({ flag: 'low_performance', isPro: false, severity: 'warning' })
    }
  }

  // ── 4. Revenge trading (PRO) ──────────────────────────
  // If a loss is immediately followed by a trade placed within REVENGE_WINDOW_MS
  let revengeFlagged = false
  for (let i = 1; i < sorted.length && !revengeFlagged; i++) {
    const prev     = sorted[i - 1]
    const curr     = sorted[i]
    const timeDiff =
      new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
    if (prev.pnl < 0 && timeDiff >= 0 && timeDiff < REVENGE_WINDOW_MS) {
      found.push({ flag: 'revenge_trading', isPro: true, severity: 'danger' })
      revengeFlagged = true
    }
  }

  // ── 5. Bad R:R (PRO) ──────────────────────────────────
  // Only consider trades where SL and TP were actually set
  const validRR = trades.filter(
    t => t.stop_loss > 0 && t.take_profit > 0 && t.entry_price > 0
  )
  if (validRR.length >= BAD_RR_MIN_SAMPLE) {
    const avgRR =
      validRR.reduce((sum, t) => {
        const risk   = Math.abs(t.entry_price - t.stop_loss)
        const reward = Math.abs(t.take_profit - t.entry_price)
        return sum + (risk > 0 ? reward / risk : 0)
      }, 0) / validRR.length

    if (avgRR < BAD_RR_THRESHOLD) {
      found.push({ flag: 'bad_rr', isPro: true, severity: 'warning' })
    }
  }

  // ── Sort by priority and return ───────────────────────
  return PRIORITY_ORDER.flatMap(flag => found.filter(i => i.flag === flag))
}

// ── Discipline Score (PRO) ───────────────────────────────────────────────────

export interface DisciplineScore {
  score: number          // 0–100
  label: 'Excellent' | 'Good' | 'Needs Work' | 'Poor'
  color: string
}

/**
 * Computes a 0–100 behavioral discipline score.  Requires >= 5 trades.
 * Returns null when there is insufficient data.
 */
export function calculateDisciplineScore(trades: Trade[]): DisciplineScore | null {
  if (trades.length < 5) return null

  let score = 100

  // Win rate component (–25 to 0)
  const wins    = trades.filter(t => t.pnl > 0).length
  const winRate = wins / trades.length
  if      (winRate < 0.30) score -= 25
  else if (winRate < 0.40) score -= 18
  else if (winRate < 0.50) score -= 10
  else if (winRate < 0.55) score -=  5

  // Overtrading (–15)
  const now     = Date.now()
  const last24h = trades.filter(
    t => now - new Date(t.created_at).getTime() < 24 * 60 * 60 * 1000
  )
  if      (last24h.length > 15) score -= 15
  else if (last24h.length > 10) score -= 10
  else if (last24h.length >  7) score -=  5

  // Losing streak (–20)
  const sorted = sortByCreatedAt(trades)
  let streak   = 0
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].pnl < 0) streak++
    else break
  }
  if      (streak >= 5) score -= 20
  else if (streak >= 3) score -= 12

  // Revenge trading (–15)
  for (let i = 1; i < sorted.length; i++) {
    const timeDiff =
      new Date(sorted[i].created_at).getTime() -
      new Date(sorted[i - 1].created_at).getTime()
    if (sorted[i - 1].pnl < 0 && timeDiff >= 0 && timeDiff < REVENGE_WINDOW_MS) {
      score -= 15
      break
    }
  }

  const clamped = Math.max(0, Math.min(100, score))

  let label: DisciplineScore['label']
  let color: string
  if      (clamped >= 80) { label = 'Excellent';  color = '#2DD4BF' }
  else if (clamped >= 60) { label = 'Good';        color = '#4361EE' }
  else if (clamped >= 40) { label = 'Needs Work';  color = '#F59E0B' }
  else                    { label = 'Poor';         color = '#EF4444' }

  return { score: clamped, label, color }
}
