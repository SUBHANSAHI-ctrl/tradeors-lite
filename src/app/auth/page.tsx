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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center px-2">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={BRANDING.logo.main} 
              alt={`${BRANDING.companyName} ${BRANDING.appName} Logo`}
              className="h-16 w-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <TrendingUp className="h-16 w-16 text-blue-400 hidden" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {BRANDING.appName}
          </h1>
          <p className="text-sm text-gray-400">
            by {BRANDING.companyName}
          </p>
          <p className="text-gray-400 text-base sm:text-lg mt-2">
            Professional trading analytics that expose your mistakes.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Need help? Contact us at <a href={`mailto:${BRANDING.supportEmail}`} className="text-blue-400 hover:text-blue-300">{BRANDING.supportEmail}</a>
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-gray-700">
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
        
        <div className="text-center text-xs sm:text-sm text-gray-400 px-2">
          <p>
            By continuing, you agree to our{' '}
            <a href={BRANDING.legal.termsUrl} className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href={BRANDING.legal.privacyUrl} className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
          <p className="mt-2">
            Need help? <a href={`mailto:${BRANDING.supportEmail}`} className="text-blue-400 hover:text-blue-300">{BRANDING.supportEmail}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
