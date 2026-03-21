'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current URL to extract the hash parameters
        const hash = window.location.hash
        
        if (hash) {
          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const type = params.get('type')
          
          if (accessToken && refreshToken) {
            // Exchange the token for a session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (error) {
              console.error('Error setting session:', error)
              setStatus('error')
              setMessage('Failed to authenticate. Please try signing in again.')
            } else if (data.session) {
              setStatus('success')
              
              if (type === 'recovery') {
                setMessage('Password reset successful! You can now set a new password.')
                // Redirect to password reset form
                setTimeout(() => {
                  router.push('/auth/reset-password')
                }, 2000)
              } else {
                setMessage('Email confirmed successfully! Redirecting to dashboard...')
                // Redirect to dashboard after email confirmation
                setTimeout(() => {
                  router.push('/dashboard')
                }, 2000)
              }
            }
          } else {
            setStatus('error')
            setMessage('Invalid authentication link.')
          }
        } else {
          // Handle query parameters (for password reset or email confirmation)
          const searchParams = new URLSearchParams(window.location.search)
          const error = searchParams.get('error')
          const errorDescription = searchParams.get('error_description')
          
          if (error) {
            setStatus('error')
            setMessage(errorDescription || 'Authentication failed.')
          } else {
            setStatus('success')
            setMessage('Authentication successful! Redirecting...')
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred.')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Processing...</h2>
              <p className="text-gray-400">Please wait while we authenticate you.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <button
                onClick={() => window.location.href = '/auth'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}