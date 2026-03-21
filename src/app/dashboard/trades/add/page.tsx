'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTrades } from '@/hooks/useTrades'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TradeForm } from '@/components/trades/TradeForm'
import { TradeFormData } from '@/types/trade'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function AddTradePage() {
  const { addTrade } = useTrades()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: TradeFormData) => {
    try {
      setLoading(true)
      setSuccess(false)
      await addTrade(data)
      setSuccess(true)
      // Wait a moment to show success, then redirect
      setTimeout(() => {
        router.push('/dashboard/trades')
      }, 1500)
    } catch (error: any) {
      console.error('Failed to add trade:', error)
      // Show the exact error message from Supabase
      const errorMessage = error.message || 'Failed to add trade'
      alert(`Error: ${errorMessage}`)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/trades')
  }

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Add New Trade</h1>
          <p className="text-gray-400 mt-2">
            Record your trading performance and analyze your results
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <TradeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Add Trade"
          />
        </div>
      </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
