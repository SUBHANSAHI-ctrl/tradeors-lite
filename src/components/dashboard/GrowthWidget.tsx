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
  lineColor: string
  fillColor: string
  label: string
}> = {
  1: {
    color:       'text-[#4A5880]',
    bar:         'bg-[#4A5880]',
    badgeBg:     'bg-[#4A5880]/10',
    badgeBorder: 'border-[#4A5880]/25',
    lineColor:   '#4A5880',
    fillColor:   '#4A5880',
    label:       'Establish a daily habit to strengthen your signal.',
  },
  2: {
    color:       'text-[#4361EE]',
    bar:         'bg-[#4361EE]',
    badgeBg:     'bg-[#4361EE]/10',
    badgeBorder: 'border-[#4361EE]/25',
    lineColor:   '#4361EE',
    fillColor:   '#4361EE',
    label:       'You\'re finding your edge — stay consistent.',
  },
  3: {
    color:       'text-[#2DD4BF]',
    bar:         'bg-[#2DD4BF]',
    badgeBg:     'bg-[#2DD4BF]/10',
    badgeBorder: 'border-[#2DD4BF]/25',
    lineColor:   '#2DD4BF',
    fillColor:   '#2DD4BF',
    label:       'Clear uptrend forming — discipline is compounding.',
  },
  4: {
    color:       'text-emerald-400',
    bar:         'bg-emerald-400',
    badgeBg:     'bg-emerald-400/10',
    badgeBorder: 'border-emerald-400/25',
    lineColor:   '#34d399',
    fillColor:   '#34d399',
    label:       'You\'re on a streak — don\'t break it.',
  },
  5: {
    color:       'text-amber-400',
    bar:         'bg-amber-400',
    badgeBg:     'bg-amber-400/10',
    badgeBorder: 'border-amber-400/25',
    lineColor:   '#fbbf24',
    fillColor:   '#fbbf24',
    label:       'Elite consistency — this is what separates professionals.',
  },
}

// ── Equity curve SVGs — each level is progressively smoother and more upward ─

const CURVE_DATA: Record<GrowthLevel, { line: string; area: string; dot: [number, number] }> = {
  // Level 1 — flat, noisy, no clear direction
  1: {
    line: 'M 4,28 L 14,20 L 22,27 L 30,18 L 38,25 L 46,16 L 54,22 L 62,19 L 70,23 L 78,26',
    area: 'M 4,28 L 14,20 L 22,27 L 30,18 L 38,25 L 46,16 L 54,22 L 62,19 L 70,23 L 78,26 L 78,42 L 4,42 Z',
    dot:  [78, 26],
  },
  // Level 2 — noisy but upward bias appearing
  2: {
    line: 'M 4,36 L 14,28 L 22,32 L 30,22 L 38,26 L 46,16 L 54,20 L 62,13 L 70,17 L 78,10',
    area: 'M 4,36 L 14,28 L 22,32 L 30,22 L 38,26 L 46,16 L 54,20 L 62,13 L 70,17 L 78,10 L 78,42 L 4,42 Z',
    dot:  [78, 10],
  },
  // Level 3 — clear uptrend with moderate oscillation
  3: {
    line: 'M 4,38 L 14,30 L 22,26 L 30,20 L 38,22 L 46,14 L 54,16 L 62,9 L 70,11 L 78,6',
    area: 'M 4,38 L 14,30 L 22,26 L 30,20 L 38,22 L 46,14 L 54,16 L 62,9 L 70,11 L 78,6 L 78,42 L 4,42 Z',
    dot:  [78, 6],
  },
  // Level 4 — smooth, consistent uptrend
  4: {
    line: 'M 4,40 L 14,32 L 22,26 L 30,20 L 38,15 L 46,11 L 54,8 L 62,6 L 70,5 L 78,4',
    area: 'M 4,40 L 14,32 L 22,26 L 30,20 L 38,15 L 46,11 L 54,8 L 62,6 L 70,5 L 78,4 L 78,42 L 4,42 Z',
    dot:  [78, 4],
  },
  // Level 5 — perfect bezier curve, no noise
  5: {
    line: 'M 4,42 C 18,38 28,26 40,16 C 52,8 64,4 78,4',
    area: 'M 4,42 C 18,38 28,26 40,16 C 52,8 64,4 78,4 L 78,42 L 4,42 Z',
    dot:  [78, 4],
  },
}

function CurveIcon({ level }: { level: GrowthLevel }) {
  const cfg = LEVEL_CONFIG[level]
  const curve = CURVE_DATA[level]

  return (
    <svg
      viewBox="0 0 82 44"
      fill="none"
      className="w-full h-full"
      aria-hidden
    >
      {/* Horizontal grid lines */}
      {[42, 28, 14].map((y) => (
        <line key={y} x1="4" y1={y} x2="78" y2={y}
          stroke={cfg.lineColor} strokeWidth="0.5" opacity="0.12" />
      ))}

      {/* Area fill */}
      <path d={curve.area} fill={cfg.fillColor} opacity="0.08" />

      {/* Main curve */}
      <path
        d={curve.line}
        stroke={cfg.lineColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot (current position) */}
      <circle
        cx={curve.dot[0]} cy={curve.dot[1]}
        r="3"
        fill={cfg.lineColor}
      />
      <circle
        cx={curve.dot[0]} cy={curve.dot[1]}
        r="5.5"
        fill={cfg.lineColor}
        opacity="0.20"
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function GrowthWidget({ trades, plan }: GrowthWidgetProps) {
  const state = useMemo(() => getUserGrowthState(trades), [trades])
  const cfg   = LEVEL_CONFIG[state.growthLevel]
  const isPro = plan === 'pro'

  // Animate progress bar after mount
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

      {/* Top bar in level color */}
      <div className={cn('h-px w-full opacity-70', cfg.bar)} />

      <div className="p-5 flex flex-col sm:flex-row gap-5">

        {/* ── Chart panel ── */}
        <div className={cn(
          'shrink-0 w-full sm:w-44 h-24 sm:h-auto rounded-lg border flex items-center justify-center p-3',
          cfg.badgeBg, cfg.badgeBorder
        )}>
          <CurveIcon level={state.growthLevel} />
        </div>

        {/* ── Info panel ── */}
        <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">

          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              {/* Section label */}
              <p className="text-[10px] uppercase tracking-widest text-[#4A5880] mb-1">
                Signal Growth
              </p>
              {/* Level */}
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
              {/* Message */}
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

          {/* Stats row */}
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

          {/* Pro upsell */}
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
