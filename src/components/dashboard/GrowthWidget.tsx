'use client'

import { useMemo, useEffect, useState } from 'react'
import { Trade } from '@/types/trade'
import { getUserGrowthState, LEVEL_NAMES, GrowthLevel } from '@/lib/growthSystem'
import { cn } from '@/lib/utils'
import { Flame, Lock } from 'lucide-react'
import Link from 'next/link'

interface GrowthWidgetProps {
  trades: Trade[]
  plan: 'free' | 'pro'
}

// ── Level config ──────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<GrowthLevel, {
  color: string
  bar: string
  badgeBg: string
  badgeBorder: string
  squareBg: string
}> = {
  1: {
    color:      'text-[#4A5880]',
    bar:        'bg-[#4A5880]',
    badgeBg:    'bg-[#4A5880]/10',
    badgeBorder:'border-[#4A5880]/25',
    squareBg:   'bg-[#4A5880]',
  },
  2: {
    color:      'text-[#4361EE]',
    bar:        'bg-[#4361EE]',
    badgeBg:    'bg-[#4361EE]/10',
    badgeBorder:'border-[#4361EE]/25',
    squareBg:   'bg-[#4361EE]',
  },
  3: {
    color:      'text-[#2DD4BF]',
    bar:        'bg-[#2DD4BF]',
    badgeBg:    'bg-[#2DD4BF]/10',
    badgeBorder:'border-[#2DD4BF]/25',
    squareBg:   'bg-[#2DD4BF]',
  },
  4: {
    color:      'text-emerald-400',
    bar:        'bg-emerald-400',
    badgeBg:    'bg-emerald-400/10',
    badgeBorder:'border-emerald-400/25',
    squareBg:   'bg-emerald-400',
  },
  5: {
    color:      'text-amber-400',
    bar:        'bg-amber-400',
    badgeBg:    'bg-amber-400/10',
    badgeBorder:'border-amber-400/25',
    squareBg:   'bg-amber-400',
  },
}

// ── 7-day heatmap — built from real trade data ────────────────────────────────

function WeeklyHeatmap({ trades, level }: { trades: Trade[]; level: GrowthLevel }) {
  const cfg = LEVEL_CONFIG[level]

  const days = useMemo(() => {
    // Count trades per date
    const countByDate: Record<string, number> = {}
    for (const t of trades) {
      const d = (t.trade_date as string).split('T')[0]
      countByDate[d] = (countByDate[d] ?? 0) + 1
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))           // oldest → newest, left → right
      const str     = date.toISOString().split('T')[0]
      const count   = countByDate[str] ?? 0
      const isToday = i === 6
      const label   = date.toLocaleDateString('en', { weekday: 'short' }).slice(0, 1)
      return { str, count, isToday, label }
    })
  }, [trades])

  const activeDays = days.filter((d) => d.count > 0).length

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Day columns */}
      <div className="flex items-end gap-1.5 w-full">
        {days.map((day) => (
          <div key={day.str} className="flex flex-col items-center gap-1 flex-1">
            {/* Trade count label (only if traded) */}
            <span className={cn(
              'text-[9px] font-semibold h-3 leading-none',
              day.count > 0 ? cfg.color : 'text-transparent'
            )}>
              {day.count > 0 ? day.count : ''}
            </span>

            {/* Square */}
            <div
              className={cn(
                'w-full rounded-md transition-all duration-300',
                day.count > 0
                  ? cn(cfg.squareBg, day.count >= 3 ? 'opacity-100' : 'opacity-70')
                  : 'bg-[#0D1121] border border-[#1A2540]',
                day.isToday && day.count === 0
                  ? 'border-[#4361EE]/30'
                  : ''
              )}
              style={{ height: day.count > 0 ? `${Math.min(28 + (day.count - 1) * 4, 44)}px` : '28px' }}
              title={`${day.str}: ${day.count} trade${day.count !== 1 ? 's' : ''}`}
            />

            {/* Day label */}
            <span className={cn(
              'text-[9px] uppercase',
              day.isToday ? 'text-[#7B8BB0] font-semibold' : 'text-[#4A5880]'
            )}>
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-[#4A5880]">
          {activeDays}/7 days active this week
        </span>
        {activeDays === 7 && (
          <span className={cn('text-[9px] font-semibold', cfg.color)}>
            Perfect week
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function GrowthWidget({ trades, plan }: GrowthWidgetProps) {
  const state = useMemo(() => getUserGrowthState(trades), [trades])
  const cfg   = LEVEL_CONFIG[state.growthLevel]
  const isPro = plan === 'pro'

  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(state.growthProgress), 150)
    return () => clearTimeout(t)
  }, [state.growthProgress])

  const nextLevelName =
    state.growthLevel < 5
      ? LEVEL_NAMES[(state.growthLevel + 1) as GrowthLevel]
      : null

  return (
    <div className="bg-[#131826] border border-[#1A2540] rounded-xl overflow-hidden">
      <div className={cn('h-px w-full opacity-70', cfg.bar)} />

      <div className="p-5 flex flex-col sm:flex-row gap-5">

        {/* ── Left: 7-day heatmap ── */}
        <div className={cn(
          'shrink-0 w-full sm:w-48 rounded-lg border p-3 flex flex-col justify-between',
          cfg.badgeBg, cfg.badgeBorder
        )}>
          <p className="text-[9px] uppercase tracking-widest text-[#4A5880] mb-2">
            This Week
          </p>
          <WeeklyHeatmap trades={trades} level={state.growthLevel} />
        </div>

        {/* ── Right: info panel ── */}
        <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#4A5880] mb-1">
                Signal Growth
              </p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border',
                  cfg.badgeBg, cfg.badgeBorder, cfg.color
                )}>
                  Lv {state.growthLevel}
                </span>
                <span className={cn('text-base font-bold', cfg.color)}>
                  {LEVEL_NAMES[state.growthLevel]}
                </span>
              </div>
              <p className="text-xs text-[#7B8BB0] mt-1 max-w-xs">
                {state.message}
              </p>
            </div>

            {/* Streak badge */}
            <div className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold',
              state.streak > 0
                ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                : 'bg-[#0D1121] border-[#1A2540] text-[#4A5880]'
            )}>
              <Flame className="h-3.5 w-3.5" />
              {state.streak}d
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">Trades</span>
              <span className="text-sm font-semibold text-[#DDE4F0]">{state.totalTrades}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">7-day rate</span>
              {isPro ? (
                <span className="text-sm font-semibold text-[#DDE4F0]">{state.consistency}%</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-[#4A5880]">
                  <Lock className="h-3 w-3" /> Pro
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">Signal score</span>
              {isPro ? (
                <span className="text-sm font-semibold text-[#DDE4F0]">{state.compositeScore}/100</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-[#4A5880]">
                  <Lock className="h-3 w-3" /> Pro
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">
                {nextLevelName ? `Progress to ${nextLevelName}` : 'Peak level reached'}
              </span>
              <span className={cn('text-[10px] font-bold tabular-nums', cfg.color)}>
                {state.growthProgress}%
              </span>
            </div>
            <div className="h-1 bg-[#0D1121] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000 ease-out', cfg.bar)}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {!isPro && (
            <Link
              href="/dashboard/upgrade"
              className="text-[10px] text-[#4361EE] hover:text-[#DDE4F0] transition-colors w-fit"
            >
              Unlock 7-day rate and signal score with Pro →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
