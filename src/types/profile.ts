// Profile types for subscription system

export type SubscriptionPlan = 'free' | 'pro';

export interface Profile {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  email?: string
}

export interface ProfileInsert {
  user_id: string;
  plan?: SubscriptionPlan;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

export interface ProfileUpdate {
  plan?: SubscriptionPlan;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  updated_at?: string;
}

// Subscription-related utilities
export const PLANS = {
  FREE: 'free' as SubscriptionPlan,
  PRO: 'pro' as SubscriptionPlan,
} as const;

export const DEFAULT_PLAN = PLANS.FREE;

export function isValidPlan(plan: string): plan is SubscriptionPlan {
  return Object.values(PLANS).includes(plan as SubscriptionPlan);
}

export function canAccessProFeatures(plan: SubscriptionPlan): boolean {
  return plan === PLANS.PRO;
}
