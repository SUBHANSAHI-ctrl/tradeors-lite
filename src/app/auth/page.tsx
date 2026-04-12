'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { BRANDING } from '@/lib/branding'
import { TrendingUp } from 'lucide-react'

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login')

  const handleToggle = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login')
  }

  const handleForgotPassword = () => {
    setAuthMode('forgot')
  }

  const handleBackToLogin = () => {
    setAuthMode('login')
  }

  return (
    <div className="min-h-screen bg-[#08090F] flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#4361EE]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full space-y-5">
        {/* Header */}
        <div className="text-left px-1">
          <div className="flex items-center gap-2.5 mb-5">
            <img
              src={BRANDING.logo.main}
              alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
              }}
            />
            <TrendingUp className="h-8 w-8 text-[#4361EE] hidden" />
            <span className="text-base font-bold text-[#DDE4F0]">{BRANDING.appName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#DDE4F0] tracking-tight mb-1">
            {authMode === 'login'  ? 'Welcome back'       :
             authMode === 'signup' ? 'Create your account' :
                                     'Reset password'}
          </h1>
          <p className="text-sm text-[#7B8BB0]">
            {authMode === 'login'  ? `Sign in to ${BRANDING.appName}`         :
             authMode === 'signup' ? 'Start tracking your trades for free'     :
                                     'We\'ll send you a reset link'}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-6 sm:p-8">
          {authMode === 'login' && (
            <LoginForm
              onToggle={handleToggle}
              onForgotPassword={handleForgotPassword}
            />
          )}
          {authMode === 'signup' && (
            <SignupForm onToggle={handleToggle} />
          )}
          {authMode === 'forgot' && (
            <ForgotPasswordForm onBack={handleBackToLogin} />
          )}
        </div>

        {/* Legal */}
        <p className="text-center text-xs text-[#4A5880] px-2">
          By continuing, you agree to our{' '}
          <a href={BRANDING.legal.termsUrl} className="text-[#4361EE] hover:text-[#3451D1] transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={BRANDING.legal.privacyUrl} className="text-[#4361EE] hover:text-[#3451D1] transition-colors">
            Privacy Policy
          </a>
          {' '}· Questions?{' '}
          <a href={`mailto:${BRANDING.supportEmail}`} className="text-[#4361EE] hover:text-[#3451D1] transition-colors">
            {BRANDING.supportEmail}
          </a>
        </p>
      </div>
    </div>
  )
}
