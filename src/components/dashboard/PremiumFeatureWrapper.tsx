'use client'

import { useUserProfile } from '@/hooks/useUserProfile'
import { canAccessAdvancedAnalytics } from '@/config/planLimits'
import Link from 'next/link'
import { Lock, Star } from 'lucide-react'

interface PremiumFeatureWrapperProps {
  children: React.ReactNode
  featureType: 'analytics' | 'charts' | 'tagging'
  title?: string
  description?: string
}

export function PremiumFeatureWrapper({ 
  children, 
  featureType,
  title = 'Pro Feature',
  description = 'Upgrade to Pro to unlock this feature'
}: PremiumFeatureWrapperProps) {
  const { profile, loading } = useUserProfile()

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-[#4A5880] text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  // If no profile or not pro, show locked version
  const isPro = profile?.plan === 'pro'
  const canAccess = featureType === 'analytics' ? canAccessAdvancedAnalytics(profile?.plan || 'free') : isPro

  if (!profile || !canAccess) {
    return (
      <div className="relative bg-[#131826] border border-[#1A2540] rounded-xl overflow-hidden">
        {/* Blurred content */}
        <div className="blur-sm opacity-40 pointer-events-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090F]/60 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6">
            <div className="flex items-center justify-center mb-4 gap-2">
              <Lock className="h-6 w-6 text-[#4361EE]" />
              <Star className="h-6 w-6 text-[#4361EE]" />
            </div>
            <h3 className="text-base font-bold text-[#DDE4F0] mb-2">{title}</h3>
            <p className="text-[#7B8BB0] text-sm mb-5">{description}</p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center px-6 py-2.5 text-sm font-semibold bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User is pro - show content normally
  return <>{children}</>
}