'use client'

import { useTrades } from '@/hooks/useTrades'
import { useUserProfile } from '@/hooks/useUserProfile'
import { generateInsights } from '@/lib/insights'
import { AlertTriangle, TrendingUp, Star, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface InsightsPanelProps {
  className?: string
}

export function InsightsPanel({ className }: InsightsPanelProps) {
  const { trades } = useTrades()
  const { profile } = useUserProfile()
  const insights = generateInsights(trades)
  const userPlan = profile?.plan || 'free'

  // Helper function to get icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'overtrading':
        return <AlertTriangle className="h-5 w-5" />
      case 'loss_streak':
        return <AlertCircle className="h-5 w-5" />
      case 'best_pair':
        return <Star className="h-5 w-5" />
      default:
        return <TrendingUp className="h-5 w-5" />
    }
  }

  // Helper function to get color based on severity
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 border-red-400/30 bg-red-500/10'
      case 'medium':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/10'
      case 'low':
        return 'text-green-400 border-green-400/30 bg-green-500/10'
      default:
        return 'text-blue-400 border-blue-400/30 bg-blue-500/10'
    }
  }

  // Helper function to get title based on insight type
  const getInsightTitle = (type: string) => {
    switch (type) {
      case 'overtrading':
        return 'Overtrading Detected'
      case 'loss_streak':
        return 'Loss Streak Pattern'
      case 'best_pair':
        return 'Best Performing Pair'
      default:
        return 'Trading Insight'
    }
  }

  if (insights.length === 0) {
    return (
      <div className={cn("glass rounded-lg p-6 border border-white/10", className)}>
        <div className="text-center text-gray-400">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-white mb-2">No Significant Patterns Detected Yet</h3>
          <p className="text-sm text-gray-400">
            Keep trading to build up your behavioral insights
          </p>
        </div>
      </div>
    )
  }

  // Handle subscription-based feature gating
  const isPro = userPlan === 'pro'
  const showAllInsights = isPro || insights.length <= 1
  const visibleInsights = showAllInsights ? insights : [insights[0]]
  const hasLockedInsights = !showAllInsights && insights.length > 1

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Trading Insights</h2>
        <div className="text-sm text-gray-400">
          {visibleInsights.length} of {insights.length} insight{insights.length !== 1 ? 's' : ''} shown
          {!isPro && insights.length > 1 && (
            <span className="ml-2 text-yellow-400">(Pro feature)</span>
          )}
        </div>
      </div>

      {/* Visible insights */}
      <div className="space-y-4">
        {visibleInsights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "glass rounded-lg p-4 border border-white/10",
              "hover:border-white/20 transition-all duration-200"
            )}
          >
            <div className="flex items-start space-x-3">
              {/* Icon with severity color */}
              <div className={cn(
                "flex-shrink-0 p-2 rounded-lg border",
                getSeverityColor(insight.severity)
              )}>
                {getInsightIcon(insight.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">
                    {getInsightTitle(insight.type)}
                  </h3>
                  {insight.severity && (
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      getSeverityColor(insight.severity)
                    )}>
                      {insight.severity.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Locked insights section for free users */}
      {hasLockedInsights && (
        <div className="relative">
          {/* Blurred remaining insights */}
          <div className="space-y-4 opacity-60 blur-sm">
            {insights.slice(1).map((insight, index) => (
              <div
                key={`locked-${index}`}
                className="glass rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-lg border",
                    getSeverityColor(insight.severity)
                  )}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">
                        {getInsightTitle(insight.type)}
                      </h3>
                      {insight.severity && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full border",
                          getSeverityColor(insight.severity)
                        )}>
                          {insight.severity.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay for locked section */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
              <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Unlock All Insights
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Upgrade to Pro to fully understand your trading behavior
              </p>
              <Link
                href="/dashboard/upgrade"
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer with helpful note */}
      <div className="mt-6 p-4 glass rounded-lg border border-white/10">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <p className="text-xs text-gray-400">
            These insights help you understand your trading patterns and improve your performance
          </p>
        </div>
      </div>
    </div>
  )
}
