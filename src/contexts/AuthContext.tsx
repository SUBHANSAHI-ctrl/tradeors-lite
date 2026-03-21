'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user ?? null)
      } else if (event === 'PASSWORD_RECOVERY') {
        // Handle password recovery
        setUser(session?.user ?? null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setUser(null)
      } else {
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        // Handle specific error cases
        let errorMessage = 'Failed to sign in'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in'
        } else if (error.message.includes('too many requests')) {
          errorMessage = 'Too many failed attempts. Please try again later'
        } else {
          errorMessage = error.message
        }
        
        return { error: errorMessage }
      }
      
      if (data.user) {
        setUser(data.user)
      } else if (data.session) {
        setUser(data.session.user)
      }
      
      // Add a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return { error: null }
    } catch (error) {
      console.error('AuthContext: signIn exception:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      
      if (error) {
        let errorMessage = 'Failed to create account'
        
        if (error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists'
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address'
        } else if (error.message.includes('weak password')) {
          errorMessage = 'Password is too weak. Please use a stronger password'
        } else {
          errorMessage = error.message
        }
        
        return { error: errorMessage, needsConfirmation: false }
      }
      
      // Check if email confirmation is required
      const needsConfirmation = !data.session && data.user ? true : false
      
      return { 
        error: null, 
        needsConfirmation 
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'An unexpected error occurred', needsConfirmation: false }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }
      
      setUser(null)
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: 'Failed to sign out' }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        let errorMessage = 'Failed to send password reset email'
        
        if (error.message.includes('not found')) {
          errorMessage = 'No account found with this email address'
        } else {
          errorMessage = error.message
        }
        
        return { error: errorMessage }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: 'Failed to send password reset email' }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: 'Failed to update password' }
    }
  }

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Session refresh error:', error)
        setUser(null)
      } else {
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword, 
      updatePassword, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
