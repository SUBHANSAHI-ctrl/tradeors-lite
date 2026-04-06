// Centralized feature gating system for subscription plans
// This file defines all plan limits and provides helper functions for feature access control

import { SubscriptionPlan } from '@/types/profile'

// Plan limits configuration
export interface PlanLimits {
  maxTrades: number
  historyDays: number
  advancedAnalytics: boolean
  advancedCharts: boolean
  tagging: boolean
}

// Plan limits configuration
const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    maxTrades: 50,
    historyDays: 14,
    advancedAnalytics: false,
    advancedCharts: false,
    tagging: false,
  },
  pro: {
    maxTrades: Infinity,
    historyDays: Infinity,
    advancedAnalytics: true,
    advancedCharts: true,
    tagging: true,
  },
}

/**
 * Get plan limits for a specific subscription plan
 * @param plan - The subscription plan ('free' | 'pro')
 * @returns PlanLimits object with all feature limits
 */
export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_LIMITS[plan]
}

/**
 * Check if user can create a new trade based on their current trade count and plan
 * @param currentTradeCount - Current number of trades the user has
 * @param plan - The user's subscription plan
 * @returns boolean indicating if user can create another trade
 */
export function canCreateTrade(currentTradeCount: number, plan: SubscriptionPlan): boolean {
  const limits = getPlanLimits(plan)
  return currentTradeCount < limits.maxTrades
}

/**
 * Check if user can access advanced analytics features
 * @param plan - The user's subscription plan
 * @returns boolean indicating if advanced analytics are available
 */
export function canAccessAdvancedAnalytics(plan: SubscriptionPlan): boolean {
  const limits = getPlanLimits(plan)
  return limits.advancedAnalytics
}

/**
 * Check if user can access advanced chart features
 * @param plan - The user's subscription plan
 * @returns boolean indicating if advanced charts are available
 */
export function canAccessAdvancedCharts(plan: SubscriptionPlan): boolean {
  const limits = getPlanLimits(plan)
  return limits.advancedCharts
}

/**
 * Check if a trade date is within the user's plan history limit
 * @param tradeDate - The date of the trade to check
 * @param plan - The user's subscription plan
 * @returns boolean indicating if the trade date is accessible
 */
export function canAccessHistory(tradeDate: Date | string, plan: SubscriptionPlan): boolean {
  const limits = getPlanLimits(plan)
  
  // If history is unlimited, always return true
  if (limits.historyDays === Infinity) {
    return true
  }

  // Convert tradeDate to Date object if it's a string
  const tradeDateObj = typeof tradeDate === 'string' ? new Date(tradeDate) : tradeDate
  
  // Calculate cutoff date
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - limits.historyDays)
  
  // Check if trade date is within the allowed history period
  return tradeDateObj >= cutoffDate
}

/**
 * Check if user can use trade tagging features
 * @param plan - The user's subscription plan
 * @returns boolean indicating if tagging is available
 */
export function canUseTagging(plan: SubscriptionPlan): boolean {
  const limits = getPlanLimits(plan)
  return limits.tagging
}

/**
 * Get a human-readable description of plan limits
 * @param plan - The subscription plan
 * @returns string describing the plan limits
 */
export function getPlanLimitsDescription(plan: SubscriptionPlan): string {
  const limits = getPlanLimits(plan)
  
  const parts = [
    `Max trades: ${limits.maxTrades === Infinity ? 'Unlimited' : limits.maxTrades}`,
    `History: ${limits.historyDays === Infinity ? 'All time' : `${limits.historyDays} days`}`,
  ]
  
  if (limits.advancedAnalytics) parts.push('Advanced analytics: Yes')
  if (limits.advancedCharts) parts.push('Advanced charts: Yes')
  if (limits.tagging) parts.push('Trade tagging: Yes')
  
  return parts.join(', ')
}

/**
 * Get the trade count limit for a specific plan
 * @param plan - The subscription plan
 * @returns number of maximum trades allowed
 */
export function getMaxTrades(plan: SubscriptionPlan): number {
  return getPlanLimits(plan).maxTrades
}

/**
 * Get the history days limit for a specific plan
 * @param plan - The subscription plan
 * @returns number of history days allowed, or Infinity for unlimited
 */
export function getHistoryDays(plan: SubscriptionPlan): number {
  return getPlanLimits(plan).historyDays
}

/**
 * Check if a specific feature is available for a plan
 * @param feature - The feature to check
 * @param plan - The subscription plan
 * @returns boolean indicating if the feature is available
 */
export function hasFeature(
  feature: 'advancedAnalytics' | 'advancedCharts' | 'tagging',
  plan: SubscriptionPlan
): boolean {
  const limits = getPlanLimits(plan)
  return limits[feature]
}

/**
 * Get upgrade suggestions based on current usage
 * @param currentTradeCount - Current number of trades
 * @param plan - Current subscription plan
 * @returns object with upgrade suggestions
 */
export function getUpgradeSuggestions(currentTradeCount: number, plan: SubscriptionPlan) {
  const limits = getPlanLimits(plan)
  const suggestions = []

  if (currentTradeCount >= limits.maxTrades * 0.9 && limits.maxTrades !== Infinity) {
    suggestions.push(`You're approaching your trade limit (${currentTradeCount}/${limits.maxTrades})`)
  }

  if (!limits.advancedAnalytics) {
    suggestions.push('Upgrade to Pro for advanced analytics')
  }

  if (!limits.advancedCharts) {
    suggestions.push('Upgrade to Pro for advanced charts')
  }

  if (!limits.tagging) {
    suggestions.push('Upgrade to Pro for trade tagging')
  }

  return suggestions
}