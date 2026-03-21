'use client'

import { useState, useRef } from 'react'
import { TradeFormData } from '@/types/trade'
import { cn } from '@/lib/utils'
import { Image, X } from 'lucide-react'

interface TradeFormProps {
  initialData?: TradeFormData
  onSubmit: (data: TradeFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function TradeForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Save Trade' 
}: TradeFormProps) {
  const [formData, setFormData] = useState<TradeFormData>(
    initialData || {
      pair: '',
      direction: 'long',
      entry_price: '',
      stop_loss: '',
      take_profit: '',
      pnl: '',
      setup_tag: '',
      notes: '',
      trade_date: new Date().toISOString().split('T')[0],
      screenshot: null,
    }
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      
      setFormData(prev => ({ ...prev, screenshot: file }))
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, screenshot: null }))
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = (): string | null => {
    if (!formData.pair.trim()) return 'Trading pair is required'
    if (!formData.setup_tag.trim()) return 'Setup tag is required'
    if (formData.entry_price === '' || isNaN(Number(formData.entry_price))) return 'Entry price is required and must be a number'
    if (formData.stop_loss === '' || isNaN(Number(formData.stop_loss))) return 'Stop loss is required and must be a number'
    if (formData.take_profit === '' || isNaN(Number(formData.take_profit))) return 'Take profit is required and must be a number'
    if (formData.pnl === '' || isNaN(Number(formData.pnl))) return 'P&L is required and must be a number'
    if (!formData.trade_date) return 'Trade date is required'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Convert string numbers to actual numbers for submission
      const submitData = {
        ...formData,
        entry_price: formData.entry_price === '' ? 0 : Number(formData.entry_price),
        stop_loss: formData.stop_loss === '' ? 0 : Number(formData.stop_loss),
        take_profit: formData.take_profit === '' ? 0 : Number(formData.take_profit),
        pnl: formData.pnl === '' ? 0 : Number(formData.pnl),
        // Keep the screenshot file if it exists
        screenshot: formData.screenshot || undefined,
      }
      
      await onSubmit(submitData)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trade')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'number') {
      // Allow empty string or valid numbers
      const numValue = value === '' ? '' : parseFloat(value)
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Pair */}
        <div>
          <label htmlFor="pair" className="block text-sm font-medium text-gray-300">
            Trading Pair
          </label>
          <input
            type="text"
            id="pair"
            name="pair"
            required
            value={formData.pair}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="e.g., BTCUSD, EURUSD, GOLD"
          />
        </div>

        {/* Direction */}
        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-gray-300">
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        {/* Entry Price */}
        <div>
          <label htmlFor="entry_price" className="block text-sm font-medium text-gray-300">
            Entry Price
          </label>
          <input
            type="number"
            id="entry_price"
            name="entry_price"
            required
            step="0.01"
            value={formData.entry_price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter entry price"
          />
        </div>

        {/* Stop Loss */}
        <div>
          <label htmlFor="stop_loss" className="block text-sm font-medium text-gray-300">
            Stop Loss
          </label>
          <input
            type="number"
            id="stop_loss"
            name="stop_loss"
            required
            step="0.01"
            value={formData.stop_loss}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter stop loss"
          />
        </div>

        {/* Take Profit */}
        <div>
          <label htmlFor="take_profit" className="block text-sm font-medium text-gray-300">
            Take Profit
          </label>
          <input
            type="number"
            id="take_profit"
            name="take_profit"
            required
            step="0.01"
            value={formData.take_profit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter take profit"
          />
        </div>

        {/* P&L */}
        <div>
          <label htmlFor="pnl" className="block text-sm font-medium text-gray-300">
            P&L ($)
          </label>
          <input
            type="number"
            id="pnl"
            name="pnl"
            required
            step="0.01"
            value={formData.pnl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Enter profit/loss"
          />
        </div>

        {/* Trade Date */}
        <div>
          <label htmlFor="trade_date" className="block text-sm font-medium text-gray-300">
            Trade Date
          </label>
          <input
            type="date"
            id="trade_date"
            name="trade_date"
            required
            value={formData.trade_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Setup Tag */}
        <div>
          <label htmlFor="setup_tag" className="block text-sm font-medium text-gray-300">
            Setup Tag
          </label>
          <input
            type="text"
            id="setup_tag"
            name="setup_tag"
            required
            value={formData.setup_tag}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="e.g., breakout, support bounce, liquidity sweep"
          />
        </div>

        {/* Screenshot Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Trade Screenshot (Optional)
          </label>
          <div className="space-y-3">
            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {/* Upload Button / Preview */}
            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-md hover:border-blue-500 hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <Image className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Upload Screenshot</span>
              </button>
            ) : (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Trade screenshot preview"
                  className="h-32 w-auto rounded-md border border-gray-600 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* File Info */}
            {formData.screenshot && (
              <p className="text-xs text-gray-500">
                {formData.screenshot.name} ({(formData.screenshot.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Trade notes, analysis, lessons learned..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
          <p className="text-sm text-green-400">Trade saved successfully!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "px-4 py-2 text-sm font-medium text-white rounded-md transition-colors",
            loading 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}