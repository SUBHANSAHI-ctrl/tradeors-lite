'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTrades } from '@/hooks/useTrades'
import { TrendingUp, Clock, BarChart3, Brain, Crown, Calendar, LogOut, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { profile, loading: profileLoading } = useUserProfile()
  const { trades, loading: tradesLoading } = useTrades()
  const router = useRouter()

  // Handle loading state
  if (profileLoading || tradesLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading profile...</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  // Handle no profile (shouldn't happen with auth guard, but handle gracefully)
  if (!profile) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Profile not found</div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const tradeCount = trades?.length || 0
  const maxTrades = 50
  const usagePercentage = (tradeCount / maxTrades) * 100
  const isNearLimit = usagePercentage > 80
  const isPro = profile.plan === 'pro'

  const handleSignOut = async () => {
    // Sign out logic would go here
    router.push('/auth')
  }

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Your Account</h1>
            <p className="text-gray-400">Manage your profile and subscription</p>
          </div>

          {/* Profile Card */}
          <div className="glass rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  A
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Account</h2>
                <p className="text-gray-400 text-sm">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Plan Status Card - Enhanced for conversions */}
          <div className="glass rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isPro 
                    ? 'You have access to all premium features' 
                    : 'You are currently on the free plan with limited features.'
                  }
                </p>
              </div>
              {isPro ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro Plan
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-purple-500/50 text-purple-300">
                  Free Plan
                </span>
              )}
            </div>

            <div className="space-y-3">
              {isPro ? (
                <>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Unlimited trades</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Full trade history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-300">Behavioral insights</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">50 trades limit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">14-day history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Basic analytics</span>
                  </div>
                </>
              )}
            </div>

            {!isPro && (
              <>
                {/* Highlight box for limit reached */}
                {tradeCount >= maxTrades && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-300 text-sm font-medium">
                        You've reached your trade limit. Upgrade to continue tracking trades.
                      </span>
                    </div>
                  </div>
                )}

                {/* Stronger CTA with Stripe integration */}
                <button 
                  onClick={handleUpgrade}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md transition-all duration-200 transform hover:scale-[1.02] mt-6"
                >
                  Unlock Unlimited Trades — $9/mo
                </button>
              </>
            )}
          </div>

          {/* Usage Section - Enhanced for conversions */}
          <div className="glass rounded-lg border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Usage</h3>
                <p className="text-gray-400 text-sm">Your trading activity</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{tradeCount}</div>
                <div className="text-sm text-gray-400">trades tracked</div>
              </div>
            </div>

            {!isPro && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Trades used</span>
                    <span className="text-sm text-gray-300">{tradeCount} / {maxTrades}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                </div>

                {tradeCount >= maxTrades ? (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-300 text-sm font-medium">
                        You've reached your limit. Upgrade to continue adding trades.
                      </span>
                    </div>
                  </div>
                ) : isNearLimit ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-300 text-sm font-medium">
                        You're close to your limit
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {isPro && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-sm font-medium">
                    You're tracking unlimited trades
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Value Section - Enhanced with benefit-driven copy */}
          {!isPro && (
            <div className="glass rounded-lg border border-white/10 p-6 mb-6">
              <p className="text-sm text-gray-400 mb-3">
                Everything you need to become a consistently profitable trader
              </p>
              <h3 className="text-xl font-semibold text-white mb-4">
                Upgrade to Pro and get:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">Unlimited tracking</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Track unlimited trades without restrictions
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Complete history</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Access your complete trading history anytime
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Winning strategies</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Identify winning strategies with advanced analytics
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Performance insights</span>
                  </div>
                  <span className="text-xs text-gray-400">
                        Understand your mistakes and improve performance
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions Section - Cleaned up */}
          <div className="glass rounded-lg border border-white/10 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button 
                className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}