import { canCreateTrade } from '@/config/planLimits'
import { Plus, TrendingUp, Clock, BarChart3, Brain } from 'lucide-react'
import Link from 'next/link'
import { Trade } from '@/types/trade'
import { Profile } from '@/types/profile'

interface TradeCreationButtonProps {
  onClick: () => void
  trades: Trade[]
  profile: Profile | null
  profileLoading: boolean
}

export function TradeCreationButton({
  onClick,
  trades,
  profile,
  profileLoading,
}: TradeCreationButtonProps) {
  if (profileLoading) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#131826] border border-[#1A2540] text-[#4A5880] rounded-lg cursor-not-allowed w-full sm:w-auto min-h-11"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </button>
    )
  }

  if (!profile) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors w-full sm:w-auto min-h-11"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">Add Trade</span>
      </button>
    )
  }

  const canCreate = canCreateTrade(trades.length, profile.plan)

  if (!canCreate) {
    return (
      <div className="w-full max-w-xl">
        <div className="bg-[#131826] border border-[#1A2540] hover:border-[#4361EE]/30 rounded-xl p-4 transition-colors duration-200">
          {/* Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4361EE]/10 text-[#4361EE] border border-[#4361EE]/25">
              Free Plan Limit Reached
            </span>
          </div>

          <h3 className="text-base font-bold text-[#DDE4F0] mb-1">
            You&apos;ve reached the free trade limit
          </h3>
          <p className="text-[#7B8BB0] text-sm mb-3">
            You&apos;ve tracked 50 trades — upgrade to keep your momentum going.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { icon: TrendingUp, label: 'Unlimited trades' },
              { icon: Clock,      label: 'Full history'     },
              { icon: BarChart3,  label: 'Advanced charts'  },
              { icon: Brain,      label: 'Behavior insights' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-[#4361EE] shrink-0" />
                <span className="text-[#7B8BB0] text-xs">{label}</span>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/upgrade"
            className="flex items-center justify-center w-full h-11 bg-[#4361EE] hover:bg-[#3451D1] text-white font-semibold text-sm rounded-lg transition-colors duration-200"
          >
            Unlock Unlimited Trades — $9/mo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors w-full sm:w-auto min-h-11"
    >
      <Plus className="h-4 w-4" />
      <span className="text-sm font-medium">Add Trade</span>
    </button>
  )
}
