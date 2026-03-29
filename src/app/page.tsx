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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Trading Journal That Shows You Why You Win — And Why You Don't
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Traderos Lite helps you track every trade, analyze your performance, and uncover the patterns behind your results — so you can improve with real data, not guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Start Tracking Free →
            </Link>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-3 text-lg font-medium border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See Your Trading Clearly</h2>
            <p className="text-gray-400 text-lg">
              Most traders don't actually know their performance. Traderos shows you exactly what's working — and what isn't.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your real profit over time</h3>
                    <BarChart3 className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400">+$12,450</div>
                  <div className="text-sm text-gray-400 mt-1">+15.6% this month</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">How often your strategy actually works</h3>
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">68%</div>
                  <div className="text-sm text-gray-400 mt-1">24W / 11L</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">How much you make vs how much you lose</h3>
                    <Zap className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-400">2.1</div>
                  <div className="text-sm text-gray-400 mt-1">Excellent ratio</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Your trading performance, visualized over time</h3>
                <div className="h-48 bg-gray-900 rounded flex items-center justify-center">
                  <div className="text-gray-500">Your trading performance, visualized over time</div>
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
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Improve</h2>
            <p className="text-gray-400 text-lg">
              Built to help you understand your trades, your behavior, and your edge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
              <p className="text-gray-400">
                See your win rate, profit factor, and performance across pairs — without manual calculations.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Target className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trade Logging</h3>
              <p className="text-gray-400">
                Log every trade with entry, exit, setup, and notes — build your personal trading database.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Visual Dashboards</h3>
              <p className="text-gray-400">
                Turn your trading data into clear charts you can actually understand and share.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <TrendingUp className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
              <p className="text-gray-400">
                Track your progress over time and see if you're actually improving.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Check className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mistake Detection</h3>
              <p className="text-gray-400">
                Spot patterns like overtrading, bad risk management, or emotional decisions.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <ArrowRight className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-400">
                Start tracking in minutes — no complex setup, no learning curve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Behavior Angle Section - NEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Your Results Come From Your Behavior</h2>
          <p className="text-xl text-gray-300 mb-6">
            Most traders focus on strategy. But your results are driven by your decisions — when you enter, how you manage risk, and how you react to losses.
          </p>
          <p className="text-lg text-gray-400">
            Traderos helps you identify patterns in your behavior so you can fix what's actually holding you back.
          </p>
        </div>
      </section>

      {/* Qovavo Ecosystem Section - NEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Built by Qovavo</h2>
          <p className="text-xl text-gray-300 mb-6">
            Traderos Lite is part of Qovavo — a growing ecosystem of tools designed to help traders improve, analyze, and scale their performance.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            We're building more tools to support every part of your trading journey.
          </p>
          <a
            href="https://qovavo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-lg font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Explore All Tools →
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Improving Your Trading Today</h2>
          <p className="text-xl text-gray-300 mb-8">
            You don't need another strategy. You need to understand your current one.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Start Tracking Free →
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
            Traderos Lite is a trading journal built to help you understand your performance, improve your decisions, and grow as a trader.
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