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

const LEVEL_CONFIG: Record<
  GrowthLevel,
  { color: string; bar: string; badge: string; glow: string }
> = {
  1: {
    color: 'text-[#4A5880]',
    bar:   'bg-[#4A5880]',
    badge: 'bg-[#4A5880]/10 border-[#4A5880]/25 text-[#4A5880]',
    glow:  '',
  },
  2: {
    color: 'text-[#4361EE]',
    bar:   'bg-[#4361EE]',
    badge: 'bg-[#4361EE]/10 border-[#4361EE]/25 text-[#4361EE]',
    glow:  '',
  },
  3: {
    color: 'text-[#2DD4BF]',
    bar:   'bg-[#2DD4BF]',
    badge: 'bg-[#2DD4BF]/10 border-[#2DD4BF]/25 text-[#2DD4BF]',
    glow:  '',
  },
  4: {
    color: 'text-emerald-400',
    bar:   'bg-emerald-400',
    badge: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400',
    glow:  '',
  },
  5: {
    color: 'text-amber-400',
    bar:   'bg-amber-400',
    badge: 'bg-amber-400/10 border-amber-400/25 text-amber-400',
    glow:  'shadow-[0_0_24px_rgba(251,191,36,0.08)]',
  },
}

// ── Tree SVG (5 progressive stages) ──────────────────────────────────────────

function TreeSVG({ level, colorClass }: { level: GrowthLevel; colorClass: string }) {
  return (
    <svg
      viewBox="0 0 44 56"
      fill="none"
      className={cn('w-11 h-14 shrink-0', colorClass)}
      aria-hidden
    >
      {/* Trunk — always present, opacity scales with level */}
      <rect
        x="19" y="42" width="6" height="12" rx="2"
        fill="currentColor"
        opacity={0.35 + level * 0.1}
      />

      {/* Layer 4 — bottom canopy (L3+) */}
      {level >= 3 && (
        <polygon
          points="22,26 7,44 37,44"
          fill="currentColor"
          opacity="0.95"
        />
      )}

      {/* Layer 3 — mid canopy (L2+) */}
      {level >= 2 && (
        <polygon
          points="22,18 9,38 35,38"
          fill="currentColor"
          opacity={level >= 3 ? 0.80 : 0.95}
        />
      )}

      {/* Layer 2 — upper canopy (L3+) */}
      {level >= 3 && (
        <polygon
          points="22,10 11,30 33,30"
          fill="currentColor"
          opacity="0.65"
        />
      )}

      {/* Layer 1 — top canopy (L4+) */}
      {level >= 4 && (
        <polygon
          points="22,4 13,24 31,24"
          fill="currentColor"
          opacity="0.50"
        />
      )}

      {/* Seed (L1 only) */}
      {level === 1 && (
        <>
          <ellipse cx="22" cy="36" rx="7" ry="5" fill="currentColor" opacity="0.45" />
          <line
            x1="22" y1="31" x2="22" y2="24"
            stroke="currentColor" strokeWidth="2" opacity="0.30"
          />
        </>
      )}

      {/* Elite star (L5 only) */}
      {level === 5 && (
        <circle cx="22" cy="4" r="3" fill="currentColor" opacity="0.90" />
      )}
    </svg>
  )
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  locked,
}: {
  label: string
  value: string
  locked?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">{label}</span>
      {locked ? (
        <span className="flex items-center gap-1 text-xs text-[#4A5880]">
          <Lock className="h-3 w-3" />
          Pro
        </span>
      ) : (
        <span className="text-sm font-semibold text-[#DDE4F0]">{value}</span>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function GrowthWidget({ trades, plan }: GrowthWidgetProps) {
  const state = useMemo(() => getUserGrowthState(trades), [trades])
  const cfg = LEVEL_CONFIG[state.growthLevel]
  const isPro = plan === 'pro'

  // Animate progress bar on mount
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(state.growthProgress), 120)
    return () => clearTimeout(t)
  }, [state.growthProgress])

  const nextLevel = LEVEL_NAMES[(Math.min(state.growthLevel + 1, 5)) as GrowthLevel]

  return (
    <div
      className={cn(
        'bg-[#131826] border border-[#1A2540] rounded-xl p-5 relative overflow-hidden',
        cfg.glow
      )}
    >
      {/* Subtle top accent */}
      <div className={cn('absolute top-0 left-0 right-0 h-px', cfg.bar, 'opacity-60')} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">

        {/* ── Left: Tree + Level ── */}
        <div className="flex items-center gap-4 shrink-0">
          <div className={cn(
            'w-16 h-16 rounded-xl border flex items-center justify-center',
            cfg.badge
          )}>
            <TreeSVG level={state.growthLevel} colorClass={cfg.color} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn('text-[10px] font-medium uppercase tracking-wider', cfg.color)}>
                Level {state.growthLevel}
              </span>
              <span className={cn(
                'inline-flex px-1.5 py-0.5 text-[10px] font-semibold rounded border',
                cfg.badge
              )}>
                {LEVEL_NAMES[state.growthLevel]}
              </span>
            </div>
            <p className="text-xs text-[#7B8BB0] max-w-[200px]">{state.message}</p>
          </div>
        </div>

        {/* ── Right: Stats + Progress ── */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Stats row */}
          <div className="flex items-center gap-6">
            {/* Streak — always visible */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#4A5880]">Streak</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#DDE4F0]">
                <Flame className={cn(
                  'h-3.5 w-3.5',
                  state.streak > 0 ? 'text-orange-400' : 'text-[#4A5880]'
                )} />
                {state.streak}d
              </span>
            </div>

            {/* Total trades — always visible */}
            <StatPill label="Trades logged" value={String(state.totalTrades)} />

            {/* Consistency — Pro only */}
            <StatPill
              label="7-day rate"
              value={`${state.consistency}%`}
              locked={!isPro}
            />

            {/* Score — Pro only */}
            <StatPill
              label="Growth score"
              value={`${state.compositeScore}/100`}
              locked={!isPro}
            />
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-[#4A5880] uppercase tracking-wider">
                {state.growthLevel < 5 ? `Progress to ${nextLevel}` : 'Peak level reached'}
              </span>
              <span className={cn('text-[10px] font-semibold', cfg.color)}>
                {state.growthProgress}%
              </span>
            </div>
            <div className="h-1.5 bg-[#0D1121] rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000 ease-out', cfg.bar)}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {/* Pro upsell if free */}
          {!isPro && (
            <Link
              href="/dashboard/upgrade"
              className="text-[10px] text-[#4361EE] hover:text-[#DDE4F0] transition-colors"
            >
              Unlock consistency insights and growth breakdown →
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
