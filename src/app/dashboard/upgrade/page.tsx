'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Check, Star, TrendingUp, BarChart3, Calendar, Tag } from 'lucide-react'
import { BRANDING } from '@/lib/branding'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function UpgradePage() {
  const { user } = useAuth()

  const handleUpgrade = async () => {
    try {
      if (!user) {
        console.error('No user found')
        return
      }

      // Get session directly from supabase since AuthContext doesn't expose it
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('No session found')
        return
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await res.json()

      console.log('Stripe response:', data)

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Stripe error:', data)
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  const proBenefits = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      title: 'Unlimited Trades',
      description: 'Track as many trades as you want without any restrictions'
    },
    {
      icon: <Calendar className="h-5 w-5 text-blue-400" />,
      title: 'Full History Access',
      description: 'Access your complete trading history, not just the last 14 days'
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-purple-400" />,
      title: 'Advanced Analytics',
      description: 'Get deeper insights with advanced performance metrics and analysis'
    },
    {
      icon: <Star className="h-5 w-5 text-yellow-400" />,
      title: 'Performance Insights',
      description: 'Detailed performance breakdowns by strategy, pair, and timeframe'
    },
    {
      icon: <Check className="h-5 w-5 text-orange-400" />,
      title: 'Advanced Charts',
      description: 'Enhanced visualizations with advanced charting capabilities'
    },
    {
      icon: <Tag className="h-5 w-5 text-pink-400" />,
      title: 'Tagging System',
      description: 'Organize and categorize your trades with custom tags'
    }
  ]

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Upgrade to Pro
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Unlock unlimited trades, advanced analytics, and full history.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12 text-center">
            <div className="mb-6">
              <div className="text-5xl font-bold text-white mb-2">$9</div>
              <div className="text-gray-400 text-lg">per month</div>
            </div>
            <div className="text-gray-300 mb-8">
              <p className="mb-2">✓ Cancel anytime</p>
              <p className="mb-2">✓ 30-day money-back guarantee</p>
              <p>✓ Secure payment processing</p>
            </div>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {proBenefits.map((benefit, index) => (
              <div key={index} className="glass rounded-lg p-6 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Compare Plans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Feature</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Free</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-white">Trades</td>
                    <td className="px-4 py-3 text-gray-400">50</td>
                    <td className="px-4 py-3 text-green-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">History</td>
                    <td className="px-4 py-3 text-gray-400">14 days</td>
                    <td className="px-4 py-3 text-green-400">All time</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">Analytics</td>
                    <td className="px-4 py-3 text-gray-400">Basic</td>
                    <td className="px-4 py-3 text-green-400">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">Charts</td>
                    <td className="px-4 py-3 text-gray-400">Basic</td>
                    <td className="px-4 py-3 text-green-400">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">Tagging</td>
                    <td className="px-4 py-3 text-gray-400">❌</td>
                    <td className="px-4 py-3 text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">Support</td>
                    <td className="px-4 py-3 text-gray-400">Community</td>
                    <td className="px-4 py-3 text-green-400">Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Level Up Your Trading?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are already using {BRANDING.appName} Pro to improve their performance and make better trading decisions.
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 mb-4 cursor-pointer"
            >
              Upgrade to Pro Now
            </button>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="glass rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  When will billing be available?
                </h3>
                <p className="text-gray-400">
                  We're working on integrating secure payment processing. You'll be notified as soon as billing is available, and you'll have priority access to upgrade.
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I downgrade later?
                </h3>
                <p className="text-gray-400">
                  Yes, you can downgrade at any time. Your account will be switched back to the free plan, and you'll retain access to your existing data.
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-gray-400">
                  Yes, we offer a 30-day money-back guarantee. If you're not satisfied with Pro, we'll refund your payment, no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              {BRANDING.appName} Pro is built by {BRANDING.companyName} to help traders improve their performance with data-driven insights.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}