'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trade } from '@/types/trade'
import { SubscriptionPlan } from '@/types/profile'
import {
  analyzeTradingBehavior,
  calculateDisciplineScore,
  BehaviorFlag,
  BehaviorInsight,
} from '@/lib/behaviorAnalysis'
import { X, AlertTriangle, TrendingDown, Zap, Target, BarChart3, Lock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ── Per-flag display config ──────────────────────────────────────────────────

interface AlertConfig {
  title: string
  message: string
  Icon: React.ElementType
}

const ALERT_CONFIG: Record<BehaviorFlag, AlertConfig> = {
  overtrading: {
    title:   'Overtrading Detected',
    message: "You're trading too frequently. Consider slowing down to maintain discipline.",
    Icon:    Zap,
  },
  losing_streak: {
    title:   'Losing Streak',
    message: 'You are on a losing streak. Step back and review your trades before continuing.',
    Icon:    TrendingDown,
  },
  low_performance: {
    title:   'Low Win Rate',
    message: 'Your win rate is below optimal. Analyze your strategy before placing more trades.',
    Icon:    Target,
  },
  revenge_trading: {
    title:   'Revenge Trading Alert',
    message: "You're entering trades too quickly after losses. Avoid revenge trading.",
    Icon:    AlertTriangle,
  },
  bad_rr: {
    title:   'Poor Risk / Reward',
    message: 'Your risk/reward ratio is not optimal. Focus on higher-quality setups.',
    Icon:    BarChart3,
  },
}

// ── Color helpers ────────────────────────────────────────────────────────────

function alertClasses(insight: BehaviorInsight) {
  return {
    container: cn(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl border',
      'transition-all duration-200',
      insight.severity === 'danger'
        ? 'bg-[#EF4444]/5 border-[#EF4444]/35'
        : 'bg-[#F59E0B]/5 border-[#F59E0B]/35'
    ),
    iconWrap: cn(
      'p-1.5 rounded-md mt-0.5 shrink-0',
      insight.severity === 'danger' ? 'bg-[#EF4444]/12' : 'bg-[#F59E0B]/12'
    ),
    icon: cn(
      'h-3.5 w-3.5',
      insight.severity === 'danger' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
    ),
  }
}

// ── Single alert row ─────────────────────────────────────────────────────────

function AlertRow({
  insight,
  plan,
  onDismiss,
}: {
  insight: BehaviorInsight
  plan: SubscriptionPlan
  onDismiss: () => void
}) {
  const isLocked = insight.isPro && plan === 'free'
  const classes  = isLocked ? null : alertClasses(insight)
  const config   = ALERT_CONFIG[insight.flag]

  if (isLocked) {
    return (
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-[#131826] border-[#4361EE]/25 transition-all duration-200 animate-fade-in-up">
        <div className="p-1.5 bg-[#4361EE]/10 rounded-md mt-0.5 shrink-0">
          <Lock className="h-3.5 w-3.5 text-[#4361EE]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#7B8BB0]">Pro Insight Detected</p>
          <p className="text-xs text-[#4A5880] mt-0.5">
            Advanced behavioral analysis is a Pro feature.{' '}
            <Link href="/dashboard/upgrade" className="text-[#4361EE] hover:text-[#3451D1] transition-colors">
              Upgrade to unlock
            </Link>
            {' '}revenge trading detection and R:R analysis.
          </p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 p-1 rounded-md text-[#4A5880] hover:text-[#7B8BB0] hover:bg-white/5 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  const { container, iconWrap, icon } = classes!
  const { Icon, title, message } = config

  return (
    <div className={cn(container, 'animate-fade-in-up')}>
      <div className={iconWrap}>
        <Icon className={icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#DDE4F0]">{title}</p>
        <p className="text-xs text-[#7B8BB0] mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss alert"
        className="shrink-0 p-1 rounded-md text-[#4A5880] hover:text-[#7B8BB0] hover:bg-white/5 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Discipline score panel (PRO) ─────────────────────────────────────────────

function DisciplineScorePanel({ trades }: { trades: Trade[] }) {
  const result = useMemo(() => calculateDisciplineScore(trades), [trades])
  if (!result) return null

  const { score, label, color } = result

  // Arc SVG for visual score gauge
  const radius     = 28
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - score / 100)

  return (
    <div className="flex items-center gap-4 bg-[#131826] border border-[#1A2540] hover:border-[#4361EE]/25 rounded-xl px-5 py-4 transition-colors duration-300 animate-fade-in-up">
      {/* Icon */}
      <div className="p-2 bg-[#4361EE]/10 rounded-lg shrink-0">
        <Shield className="h-4 w-4 text-[#4361EE]" />
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#DDE4F0]">Daily Discipline Score</p>
        <p className="text-xs text-[#7B8BB0] mt-0.5">Based on your behavioral patterns</p>
      </div>

      {/* Score gauge */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Arc gauge */}
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke="#1A2540"
              strokeWidth="5"
            />
            {/* Progress */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color }}>{score}</span>
          </div>
        </div>

        {/* Label badge */}
        <div className="text-right">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}30`, backgroundColor: `${color}12` }}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface BehaviorAlertProps {
  trades: Trade[]
  plan: SubscriptionPlan
}

export function BehaviorAlert({ trades, plan }: BehaviorAlertProps) {
  // Track dismissed flags; key = flag name so re-appearing only happens on new trades
  const [dismissed, setDismissed] = useState<Set<BehaviorFlag>>(new Set())
  const [snapshotLen, setSnapshotLen] = useState(trades.length)

  // Reset dismissals when a new trade is added
  useEffect(() => {
    if (trades.length !== snapshotLen) {
      setDismissed(new Set())
      setSnapshotLen(trades.length)
    }
  }, [trades.length, snapshotLen])

  const allInsights = useMemo(() => analyzeTradingBehavior(trades), [trades])

  // Max 2 visible at a time, filtered by dismissed
  const visible = allInsights
    .filter(i => !dismissed.has(i.flag))
    .slice(0, 2)

  const showScore = plan === 'pro' && trades.length >= 5

  // Nothing to render
  if (visible.length === 0 && !showScore) return null

  return (
    <div className="space-y-2.5">
      {visible.map(insight => (
        <AlertRow
          key={insight.flag}
          insight={insight}
          plan={plan}
          onDismiss={() => setDismissed(prev => new Set([...prev, insight.flag]))}
        />
      ))}

      {showScore && <DisciplineScorePanel trades={trades} />}
    </div>
  )
}
