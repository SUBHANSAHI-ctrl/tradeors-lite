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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#DDE4F0] tracking-tight">
              Add New Trade
            </h1>
            <p className="text-[#4A5880] mt-1 text-sm">
              Record your trading performance and analyse your results
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#131826] border border-[#1A2540] rounded-xl p-6">
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
