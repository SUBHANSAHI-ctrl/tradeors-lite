'use client'

import Image from 'next/image'
import { TrendingUp, BarChart3, Target, Zap, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { BRANDING } from '@/lib/branding'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src={BRANDING.logo.main} 
                alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  // Fallback to icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <TrendingUp className="h-8 w-8 text-blue-400 hidden" />
              <span className="ml-2 text-xl font-bold">{BRANDING.appName} Lite</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={BRANDING.logo.main} 
              alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
              className="h-16 w-16 object-contain mr-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <TrendingUp className="h-16 w-16 text-blue-400 hidden mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Professional trading analytics by {BRANDING.companyName}.
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track your trades, analyze performance, and discover why you win or lose. 
            Professional-grade analytics brought to you by {BRANDING.companyName}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Start Free Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-3 text-lg font-medium border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Professional Trading Analytics</h2>
            <p className="text-gray-400 text-lg">
              See your trading performance like never before
            </p>
          </div>
          <div className="relative">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total P&L</h3>
                    <BarChart3 className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400">+$12,450</div>
                  <div className="text-sm text-gray-400 mt-1">+15.6% this month</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Win Rate</h3>
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">68%</div>
                  <div className="text-sm text-gray-400 mt-1">24W / 11L</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Profit Factor</h3>
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400">2.1</div>
                  <div className="text-sm text-gray-400 mt-1">Excellent ratio</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Equity Curve</h3>
                <div className="h-48 bg-gray-900 rounded flex items-center justify-center">
                  <div className="text-gray-500">Interactive charts coming to life...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400 text-lg">
              Powerful features designed for serious traders
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-400">
                Track win rates, profit factors, equity curves, and performance by trading pair. 
                Get insights that matter.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Target className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trade Logging</h3>
              <p className="text-gray-400">
                Record every trade with detailed information including entry, exit, setup tags, 
                and personal notes for future reference.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Visual Dashboards</h3>
              <p className="text-gray-400">
                Beautiful, professional-grade charts and visualizations that make your 
                trading data easy to understand and share.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <TrendingUp className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
              <p className="text-gray-400">
                Monitor your progress over time with detailed performance metrics 
                and identify your most profitable trading strategies.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Check className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mistake Detection</h3>
              <p className="text-gray-400">
                Identify patterns in your losing trades and learn from your mistakes. 
                Turn losses into valuable trading lessons.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <ArrowRight className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-400">
                Intuitive interface designed for traders. No complex setup required - 
                just sign up and start tracking your trades immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of traders who are already using TraderOS Lite to improve their performance.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever • Unlimited trades
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={BRANDING.logo.main} 
              alt={`${BRANDING.companyName} Logo`}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <TrendingUp className="h-6 w-6 text-blue-400 hidden" />
            <span className="ml-2 text-lg font-bold">{BRANDING.appName} Lite by {BRANDING.companyName}</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 {BRANDING.companyName}. {BRANDING.metadata.description}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">
              Support: <a href={`mailto:${BRANDING.supportEmail}`} className="text-blue-400 hover:text-blue-300">{BRANDING.supportEmail}</a>
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <a href={BRANDING.legal.termsUrl} className="text-gray-400 hover:text-white">Terms of Service</a>
              <span className="text-gray-600">•</span>
              <a href={BRANDING.legal.privacyUrl} className="text-gray-400 hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}