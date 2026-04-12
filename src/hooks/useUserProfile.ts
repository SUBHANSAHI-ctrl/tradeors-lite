import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types/profile'

interface UseUserProfileReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
}

export function useUserProfile(): UseUserProfileReturn {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      setError(null)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          setError(error.message)
          setProfile(null)
        } else if (data) {
          setProfile(data as Profile)
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return { profile, loading, error }
}
