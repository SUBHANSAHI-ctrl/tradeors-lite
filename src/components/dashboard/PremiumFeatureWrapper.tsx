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
      <div className="glass rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  // If no profile or not pro, show locked version
  const isPro = profile?.plan === 'pro'
  const canAccess = featureType === 'analytics' ? canAccessAdvancedAnalytics(profile?.plan || 'free') : isPro

  if (!profile || !canAccess) {
    return (
      <div className="relative glass rounded-lg p-6 border border-white/10">
        {/* Blurred content */}
        <div className="blur-sm opacity-60 pointer-events-none">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-yellow-400 mr-2" />
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-4">{description}</p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
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