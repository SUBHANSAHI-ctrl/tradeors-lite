import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Trade, TradeFormData } from '@/types/trade'
import { uploadTradeScreenshot } from '@/lib/storage'

interface UseTradesReturn {
  trades: Trade[]
  loading: boolean
  error: string | null
  fetchTrades: () => Promise<void>
  addTrade: (trade: TradeFormData) => Promise<void>
  updateTrade: (id: string, trade: TradeFormData) => Promise<void>
  deleteTrade: (id: string) => Promise<void>
}

export function useTrades(): UseTradesReturn {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTrades = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch('/api/trades', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch trades')
      }

      const data = await response.json()
      setTrades(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades')
    } finally {
      setLoading(false)
    }
  }, [user])

  const addTrade = useCallback(async (tradeData: TradeFormData) => {
    if (!user) throw new Error('No user logged in')

    try {
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // Debug: Check if screenshot exists
      console.log('addTrade - tradeData received:', tradeData)
      console.log('addTrade - screenshot file:', tradeData.screenshot)
      console.log('addTrade - screenshot type:', typeof tradeData.screenshot)

      // Handle screenshot upload if provided
      let screenshotUrl: string | null = null
      if (tradeData.screenshot) {
        console.log('addTrade - uploading screenshot...')
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) throw new Error('No user found for upload')

        // Generate a temporary ID for the trade (we'll get the real one after insert)
        const tempTradeId = `temp-${Date.now()}`
        const uploadResult = await uploadTradeScreenshot(tradeData.screenshot, currentUser.id, tempTradeId)
        
        console.log('addTrade - upload result:', uploadResult)
        
        if (uploadResult.url) {
          screenshotUrl = uploadResult.url
          console.log('addTrade - screenshot URL generated:', screenshotUrl)
        } else {
          console.error('addTrade - screenshot upload failed:', uploadResult.error)
        }
      }

      // Build payload without File object
      const { screenshot, ...tradeDataWithoutFile } = tradeData
      const payload = {
        ...tradeDataWithoutFile,
        screenshot_url: screenshotUrl || null
      }

      console.log('addTrade - final payload being sent to API:', payload)
      console.log('addTrade - screenshot_url in payload:', payload.screenshot_url)

      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('addTrade - API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add trade')
      }

      const newTrade = await response.json()
      console.log('addTrade - response trade:', newTrade)
      setTrades(prev => [newTrade, ...prev])
    } catch (err) {
      console.error('addTrade - error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add trade')
      throw err
    }
  }, [user])

  const updateTrade = useCallback(async (id: string, tradeData: TradeFormData) => {
    if (!user) throw new Error('No user logged in')

    try {
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      // Debug: Check if screenshot exists
      console.log('updateTrade - tradeData received:', tradeData)
      console.log('updateTrade - screenshot file:', tradeData.screenshot)
      console.log('updateTrade - screenshot type:', typeof tradeData.screenshot)

      // Handle screenshot upload if provided
      let screenshotUrl: string | null = null
      if (tradeData.screenshot) {
        console.log('updateTrade - uploading screenshot...')
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (!currentUser) throw new Error('No user found for upload')

        const uploadResult = await uploadTradeScreenshot(tradeData.screenshot, currentUser.id, id)
        
        console.log('updateTrade - upload result:', uploadResult)
        
        if (uploadResult.url) {
          screenshotUrl = uploadResult.url
          console.log('updateTrade - screenshot URL generated:', screenshotUrl)
        } else {
          console.error('updateTrade - screenshot upload failed:', uploadResult.error)
        }
      }

      // Build payload without File object
      const { screenshot, ...tradeDataWithoutFile } = tradeData
      const payload = {
        ...tradeDataWithoutFile,
        ...(screenshotUrl ? { screenshot_url: screenshotUrl } : {}),
      }

      console.log('updateTrade - final payload:', payload)

      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update trade')
      }

      const updatedTrade = await response.json()
      console.log('updateTrade - response trade:', updatedTrade)
      setTrades(prev => prev.map(trade => 
        trade.id === id ? updatedTrade : trade
      ))
    } catch (err) {
      console.error('updateTrade - error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update trade')
      throw err
    }
  }, [user])

  const deleteTrade = useCallback(async (id: string) => {
    if (!user) throw new Error('No user logged in')

    try {
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete trade')
      }

      setTrades(prev => prev.filter(trade => trade.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete trade')
      throw err
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchTrades()
    } else {
      setTrades([])
      setLoading(false)
    }
  }, [user, fetchTrades])

  return {
    trades,
    loading,
    error,
    fetchTrades,
    addTrade,
    updateTrade,
    deleteTrade,
  }
}