import { useUserProfile } from '@/hooks/useUserProfile'
import { canCreateTrade } from '@/config/planLimits'
import { Plus, TrendingUp, Clock, BarChart3, Brain } from 'lucide-react'
import Link from 'next/link'

interface TradeCreationButtonProps {
  onClick: () => void
  trades: any[]
  profile: any | null
  profileLoading: boolean
}

export function TradeCreationButton({ 
  onClick, 
  trades, 
  profile, 
  profileLoading 
}: TradeCreationButtonProps) {
  // Handle loading state
  if (profileLoading) {
    return (
      <button
        disabled
        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-gray-400 rounded-md cursor-not-allowed w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        <span>Loading...</span>
      </button>
    )
  }

  // Handle no profile (shouldn't happen with our auth, but handle gracefully)
  if (!profile) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        <span>Add Trade</span>
      </button>
    )
  }

  // Check if user can create trades based on their subscription
  const canCreate = canCreateTrade(trades.length, profile.plan)

  if (!canCreate) {
    return (
      <div className="w-full max-w-xl mx-auto">
        {/* Premium Upgrade Card - High Converting Design */}
        <div className="relative group">
          {/* Subtle border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity duration-200"></div>
          
          {/* Main card content - premium and compact */}
          <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 hover:border-purple-500/40 transition-all duration-200">
            {/* Small badge */}
            <div className="text-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Free Plan Limit Reached
              </span>
            </div>

            {/* Title - tension creating */}
            <h3 className="text-lg font-bold text-white text-center mb-1">
              You're blocked from adding more trades
            </h3>

            {/* Subtext - problem framing */}
            <p className="text-gray-300 text-sm text-center mb-2">
              You've hit the free limit. Your progress is now paused until you upgrade.
            </p>

            {/* Progress context - momentum messaging */}
            <p className="text-purple-300 text-xs text-center mb-3 font-medium">
              You tracked 50 trades — don't lose momentum now.
            </p>

            {/* Inline benefits - 2 column grid with icons */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400/70" />
                <span className="text-gray-300 text-xs">Unlimited trades</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400/70" />
                <span className="text-gray-300 text-xs">Full history</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-400/70" />
                <span className="text-gray-300 text-xs">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-yellow-400/70" />
                <span className="text-gray-300 text-xs">Behavioral insights</span>
              </div>
            </div>

            {/* Light urgency badge */}
            <p className="text-xs text-purple-300 text-center mb-2 font-medium">
              Most active traders upgrade at this point
            </p>

            {/* Full-width gradient action bar - dominant CTA */}
            <Link
              href="/dashboard/upgrade"
              className="block w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg mt-4"
            >
              <span className="text-white font-semibold text-base text-center">
                Unlock Unlimited Trades — $9/mo
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User can create trades - show normal button
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full sm:w-auto"
    >
      <Plus className="h-4 w-4" />
      <span>Add Trade</span>
    </button>
  )
}