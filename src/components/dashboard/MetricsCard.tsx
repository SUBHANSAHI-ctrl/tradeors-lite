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
  className 
}: MetricsCardProps) {
  const changeColor = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  }[changeType]

  const glowColor = {
    positive: '',
    negative: '',
    neutral: '',
  }[changeType]

  return (
    <div className={cn(
      "glass rounded-2xl p-6 card-hover group relative overflow-hidden animate-fade-in",
      className
    )}>
      {/* Subtle hover glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        changeType === 'positive' ? "shadow-lg shadow-green-500/20" :
        changeType === 'negative' ? "shadow-lg shadow-red-500/20" :
        "shadow-lg shadow-blue-500/20"
      )} />
      
      {/* Subtle top accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r",
        changeType === 'positive' ? "from-green-400/60 to-emerald-400/60" :
        changeType === 'negative' ? "from-red-400/60 to-pink-400/60" :
        "from-blue-400/60 to-purple-400/60"
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
              {changeType === 'positive' && (
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              )}
              {changeType === 'negative' && (
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              )}
            </div>
            
            {subtitle && (
              <p className="text-xs text-gray-500 mb-1 font-mono">{subtitle}</p>
            )}
            
            <p className="text-3xl font-bold text-white mb-2 font-mono tracking-tight">{value}</p>
            
            {change && (
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  changeType === 'positive' ? "bg-green-400" :
                  changeType === 'negative' ? "bg-red-400" :
                  "bg-gray-400"
                )} />
                <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="ml-4 flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center relative",
              "bg-gradient-to-br from-white/5 to-white/2",
              "border border-white/5 group-hover:border-white/10 transition-all duration-300",
              "group-hover:scale-105"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                {icon}
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
