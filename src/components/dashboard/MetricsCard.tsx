import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  subtitle?: string
  className?: string
}

export function MetricsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle,
  className,
}: MetricsCardProps) {
  const changeColor = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-[#4A5880]',
  }[changeType]

  return (
    <div className={cn(
      'bg-[#131826] border border-[#1A2540] rounded-xl p-4 relative overflow-hidden group',
      className
    )}>
      {/* Top accent line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-px',
        changeType === 'positive' ? 'bg-emerald-400/40' :
        changeType === 'negative' ? 'bg-red-400/40' :
        'bg-[#4361EE]/40'
      )} />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-[#4A5880] uppercase tracking-wider mb-1.5">
            {title}
          </p>

          {subtitle && (
            <p className="text-[10px] text-[#4A5880] mb-1">{subtitle}</p>
          )}

          <p className="text-xl font-bold text-[#DDE4F0] font-mono tracking-tight truncate">
            {value}
          </p>

          {change && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0',
                changeType === 'positive' ? 'bg-emerald-400' :
                changeType === 'negative' ? 'bg-red-400' :
                'bg-[#4A5880]'
              )} />
              <p className={cn('text-[10px] font-medium', changeColor)}>{change}</p>
            </div>
          )}
        </div>

        {icon && (
          <div className="shrink-0 w-9 h-9 rounded-lg bg-[#0D1121] border border-[#1A2540] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
