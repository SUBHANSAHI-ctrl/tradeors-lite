// Example usage of useUserProfile hook
// This file shows how to integrate the subscription system into your components

import { useUserProfile } from '@/hooks/useUserProfile'
import { Profile } from '@/types/profile'

// Example 1: Basic profile display
export function ProfileDisplay() {
  const { profile, loading, error } = useUserProfile()

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!profile) {
    return <div>No profile found</div>
  }

  return (
    <div>
      <h3>Your Profile</h3>
      <p>Plan: {profile.plan}</p>
      <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
    </div>
  )
}

// Example 2: Feature gating based on subscription
export function PremiumFeature() {
  const { profile, loading } = useUserProfile()

  if (loading || !profile) {
    return <div>Loading...</div>
  }

  // Check if user has pro features
  const hasProFeatures = profile.plan === 'pro'

  if (!hasProFeatures) {
    return (
      <div>
        <p>This feature requires a Pro subscription.</p>
        <button>Upgrade to Pro</button>
      </div>
    )
  }

  return (
    <div>
      <h3>Premium Feature</h3>
      <p>Welcome to the Pro features!</p>
      {/* Your premium content here */}
    </div>
  )
}

// Example 3: Dashboard integration
export function DashboardHeader() {
  const { profile, loading } = useUserProfile()

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="dashboard-header">
      <h1>Trading Dashboard</h1>
      {profile && (
        <div className="subscription-badge">
          {profile.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
        </div>
      )}
    </div>
  )
}

// Example 4: Conditional rendering based on plan
export function AnalyticsSection() {
  const { profile, loading } = useUserProfile()

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!profile) {
    return <div>Please log in to view analytics</div>
  }

  return (
    <div>
      <h2>Trading Analytics</h2>
      
      {/* Always available features */}
      <div className="basic-analytics">
        {/* Basic analytics content */}
      </div>

      {/* Pro-only features */}
      {profile.plan === 'pro' && (
        <div className="pro-analytics">
          <h3>Advanced Analytics</h3>
          {/* Pro features content */}
        </div>
      )}
    </div>
  )
}

// Example 5: Error handling with retry
export function ProfileWithRetry() {
  const { profile, loading, error } = useUserProfile()

  if (loading) {
    return <div className="loading">Loading profile...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Failed to load profile: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="no-profile">
        <p>No profile found. Please contact support.</p>
      </div>
    )
  }

  return (
    <div className="profile-content">
      <h2>Your Trading Profile</h2>
      <p>Current Plan: {profile.plan}</p>
      <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
    </div>
  )
}