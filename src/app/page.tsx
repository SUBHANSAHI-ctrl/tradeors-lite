'use client'

import { TrendingUp, BarChart3, Target, Zap, ArrowRight, Check, Activity } from 'lucide-react'
import Link from 'next/link'
import { BRANDING } from '@/lib/branding'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#08090F] text-[#DDE4F0]">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#08090F]/90 backdrop-blur-md border-b border-[#1A2540]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src={BRANDING.logo.main}
                alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
                className="h-7 w-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                }}
              />
              <TrendingUp className="h-7 w-7 text-[#4361EE] hidden" />
              <span className="ml-2.5 text-base font-bold text-[#DDE4F0]">{BRANDING.appName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-[#7B8BB0] hover:text-[#DDE4F0] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-16 left-1/4 w-[480px] h-[480px] bg-[#4361EE]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy */}
            <div className="animate-fade-in-up">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E2844] bg-[#0F1220] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-[#7B8BB0] font-medium">
                  Live Trading Analytics
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
                Track Every Trade.{' '}
                <span className="bg-gradient-to-r from-[#4361EE] to-[#2DD4BF] bg-clip-text text-transparent">
                  Analyze Every Pattern.
                </span>
              </h1>

              <p className="text-lg text-[#7B8BB0] leading-relaxed mb-8 max-w-lg">
                A professional trading journal with real analytics — so you can understand your
                edge, eliminate mistakes, and grow with data instead of guesswork.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors w-full sm:w-auto"
                >
                  Start Tracking Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-[#1E2844] hover:border-[#4361EE]/40 text-[#7B8BB0] hover:text-[#DDE4F0] rounded-lg transition-colors w-full sm:w-auto"
                >
                  See How It Works
                </a>
              </div>

              <p className="mt-5 text-xs text-[#4A5880]">
                Free forever · No credit card required · 50 trades included
              </p>
            </div>

            {/* RIGHT — 3D dashboard card */}
            <div className="relative flex items-center justify-center animate-fade-in-up-2 mt-8 lg:mt-0">
              {/* Ambient glow behind card */}
              <div className="absolute inset-8 bg-[#4361EE]/10 rounded-3xl blur-2xl pointer-events-none" />

              {/* Floating wrapper applies the continuous float + rotation */}
              <div className="relative animate-float w-full max-w-[360px]">
                {/* Depth shadow layer */}
                <div className="absolute inset-0 bg-[#0D1121] rounded-2xl translate-x-3 translate-y-3 border border-[#1A2540]/50" />

                {/* Main card */}
                <div className="relative bg-[#131826] border border-[#1A2540] rounded-2xl p-5 rotate-[2deg]">

                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-[#4A5880] uppercase tracking-widest mb-0.5">Portfolio Overview</p>
                      <p className="text-xl font-bold text-[#DDE4F0]">+$12,450</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[11px] text-emerald-400 font-medium">Live</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-[#0D1121] border border-[#1A2540] rounded-xl p-3 mb-4">
                    <svg viewBox="0 0 300 96" className="w-full h-24" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#4361EE" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#4361EE" stopOpacity="0"   />
                        </linearGradient>
                      </defs>
                      {/* Grid */}
                      <line x1="0" y1="24" x2="300" y2="24" stroke="#1A2540" strokeWidth="0.5" />
                      <line x1="0" y1="48" x2="300" y2="48" stroke="#1A2540" strokeWidth="0.5" />
                      <line x1="0" y1="72" x2="300" y2="72" stroke="#1A2540" strokeWidth="0.5" />
                      {/* Area */}
                      <path
                        d="M0,80 L35,72 L70,64 L105,56 L140,44 L175,34 L210,26 L245,18 L280,12 L300,8 L300,96 L0,96 Z"
                        fill="url(#heroFill)"
                      />
                      {/* Line */}
                      <path
                        d="M0,80 L35,72 L70,64 L105,56 L140,44 L175,34 L210,26 L245,18 L280,12 L300,8"
                        fill="none"
                        stroke="#4361EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-draw-line"
                      />
                      {/* End dot */}
                      <circle cx="300" cy="8" r="3"   fill="#4361EE" />
                      <circle cx="300" cy="8" r="6.5" fill="#4361EE" fillOpacity="0.25" />
                    </svg>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0D1121] border border-[#1A2540] rounded-lg p-3 animate-fade-in-up-1">
                      <p className="text-[9px] text-[#4A5880] uppercase tracking-wider mb-1">Win Rate</p>
                      <p className="text-sm font-bold text-[#2DD4BF]">68%</p>
                      <p className="text-[9px] text-[#4A5880] mt-0.5">24W / 11L</p>
                    </div>
                    <div className="bg-[#0D1121] border border-[#1A2540] rounded-lg p-3 animate-fade-in-up-2">
                      <p className="text-[9px] text-[#4A5880] uppercase tracking-wider mb-1">Trades</p>
                      <p className="text-sm font-bold text-[#DDE4F0]">143</p>
                      <p className="text-[9px] text-[#4A5880] mt-0.5">This month</p>
                    </div>
                    <div className="bg-[#0D1121] border border-[#1A2540] rounded-lg p-3 animate-fade-in-up-3">
                      <p className="text-[9px] text-[#4A5880] uppercase tracking-wider mb-1">Profit F.</p>
                      <p className="text-sm font-bold text-[#4361EE]">2.1x</p>
                      <p className="text-[9px] text-emerald-400 mt-0.5">Excellent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1220]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-widest text-[#4361EE] font-medium mb-3">Features</p>
            <h2 className="text-4xl font-bold tracking-tight text-[#DDE4F0] mb-4">
              Everything you need to improve
            </h2>
            <p className="text-[#7B8BB0] text-lg max-w-lg">
              Built to help you understand your trades, your behavior, and your edge — not just store data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: BarChart3,
                color: 'text-[#4361EE]',
                title: 'Advanced Analytics',
                desc: 'Win rate, profit factor, and performance across pairs — calculated automatically.',
              },
              {
                icon: Target,
                color: 'text-[#2DD4BF]',
                title: 'Trade Logging',
                desc: 'Log every trade with entry, exit, setup, and notes. Build your personal edge database.',
              },
              {
                icon: Activity,
                color: 'text-[#4361EE]',
                title: 'Visual Dashboards',
                desc: 'Turn raw data into clear charts you can understand, act on, and share.',
              },
              {
                icon: TrendingUp,
                color: 'text-[#2DD4BF]',
                title: 'Performance Tracking',
                desc: 'See if you\'re actually improving over time with objective data, not feelings.',
              },
              {
                icon: Zap,
                color: 'text-[#4361EE]',
                title: 'Mistake Detection',
                desc: 'Spot overtrading, poor risk management, and emotional decision patterns early.',
              },
              {
                icon: Check,
                color: 'text-[#2DD4BF]',
                title: 'Simple to Start',
                desc: 'Up and running in minutes. No complex setup, no learning curve, no bloat.',
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="bg-[#131826] border border-[#1A2540] hover:border-[#4361EE]/30 rounded-xl p-6 transition-colors duration-300"
                >
                  <Icon className={`h-7 w-7 ${f.color} mb-4`} />
                  <h3 className="text-base font-semibold text-[#DDE4F0] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#7B8BB0] leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Analytics Preview ──────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#08090F]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-widest text-[#4361EE] font-medium mb-3">Analytics</p>
            <h2 className="text-4xl font-bold tracking-tight text-[#DDE4F0] mb-4">
              See your trading clearly
            </h2>
            <p className="text-[#7B8BB0] text-lg max-w-lg">
              Most traders don&apos;t know their real numbers. TraderOS shows you exactly what&apos;s working — and what isn&apos;t.
            </p>
          </div>

          <div className="bg-[#131826] border border-[#1A2540] rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {[
                { label: 'Net Profit', value: '+$12,450', sub: '+15.6% this month', icon: BarChart3, color: 'text-emerald-400', iconColor: 'text-emerald-400' },
                { label: 'Win Rate',   value: '68%',       sub: '24W / 11L',         icon: Target,   color: 'text-[#4361EE]',  iconColor: 'text-[#4361EE]' },
                { label: 'Profit Factor', value: '2.1×',  sub: 'Excellent ratio',   icon: Zap,      color: 'text-[#2DD4BF]',  iconColor: 'text-[#2DD4BF]' },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="bg-[#0D1121] border border-[#1A2540] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[11px] text-[#4A5880] uppercase tracking-wider">{s.label}</p>
                      <Icon className={`h-4 w-4 ${s.iconColor}`} />
                    </div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-[#4A5880] mt-1">{s.sub}</p>
                  </div>
                )
              })}
            </div>

            {/* Equity curve preview */}
            <div className="bg-[#0D1121] border border-[#1A2540] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#DDE4F0]">Equity Curve</p>
                <span className="text-xs text-[#4A5880] font-mono">35 data points</span>
              </div>
              <div className="h-32">
                <svg viewBox="0 0 600 120" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#4361EE" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#4361EE" stopOpacity="0"   />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="30"  x2="600" y2="30"  stroke="#1A2540" strokeWidth="0.5" />
                  <line x1="0" y1="60"  x2="600" y2="60"  stroke="#1A2540" strokeWidth="0.5" />
                  <line x1="0" y1="90"  x2="600" y2="90"  stroke="#1A2540" strokeWidth="0.5" />
                  <path
                    d="M0,105 L60,98 L120,90 L180,82 L240,72 L300,60 L360,50 L420,40 L480,28 L540,18 L600,10 L600,120 L0,120 Z"
                    fill="url(#equityFill)"
                  />
                  <path
                    d="M0,105 L60,98 L120,90 L180,82 L240,72 L300,60 L360,50 L420,40 L480,28 L540,18 L600,10"
                    fill="none"
                    stroke="#4361EE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Behavioral Edge ────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1220]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-widest text-[#4361EE] font-medium mb-3">Behavioral Edge</p>
            <h2 className="text-4xl font-bold tracking-tight text-[#DDE4F0] mb-6">
              Your results come from your behavior
            </h2>
            <p className="text-lg text-[#7B8BB0] mb-4 leading-relaxed">
              Most traders focus on finding the next strategy. But your results are driven by
              your decisions — when you enter, how you manage risk, and how you react to losses.
            </p>
            <p className="text-[#4A5880]">
              TraderOS helps you identify the patterns in your behavior so you can fix what&apos;s
              actually holding you back — not just what feels like the problem.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#08090F]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#131826] border border-[#1A2540] rounded-2xl p-10">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold tracking-tight text-[#DDE4F0] mb-4">
                Start improving your trading today
              </h2>
              <p className="text-[#7B8BB0] text-lg mb-8">
                You don&apos;t need another strategy. You need to understand the one you already have.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-[#4361EE] hover:bg-[#3451D1] text-white rounded-lg transition-colors w-full sm:w-auto"
                >
                  Start Tracking Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://qovavo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-[#1E2844] hover:border-[#4361EE]/40 text-[#7B8BB0] hover:text-[#DDE4F0] rounded-lg transition-colors w-full sm:w-auto"
                >
                  Explore {BRANDING.companyName}
                </a>
              </div>
              <p className="text-xs text-[#4A5880] mt-6">
                No credit card required · Free forever · 50 trades included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-[#1A2540] py-8 px-4 sm:px-6 lg:px-8 bg-[#08090F]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <img
                src={BRANDING.logo.main}
                alt={`${BRANDING.companyName} Logo`}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                }}
              />
              <TrendingUp className="h-5 w-5 text-[#4361EE] hidden" />
              <span className="ml-2 text-sm font-semibold text-[#DDE4F0]">
                {BRANDING.appName} by {BRANDING.companyName}
              </span>
            </div>
            <div className="flex items-center gap-5 text-xs text-[#4A5880]">
              <a href={`mailto:${BRANDING.supportEmail}`} className="hover:text-[#7B8BB0] transition-colors">
                {BRANDING.supportEmail}
              </a>
              <a href={BRANDING.legal.termsUrl} className="hover:text-[#7B8BB0] transition-colors">Terms</a>
              <a href={BRANDING.legal.privacyUrl} className="hover:text-[#7B8BB0] transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
