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
  submitLabel = 'Save Trade',
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
    // Only pair is required for fast testing
    if (!formData.pair.trim()) return 'Trading pair is required'

    // Allow empty fields for faster testing - will set defaults later
    if (formData.entry_price !== '' && isNaN(Number(formData.entry_price))) return 'Entry price must be a number'
    if (formData.stop_loss !== '' && isNaN(Number(formData.stop_loss))) return 'Stop loss must be a number'
    if (formData.take_profit !== '' && isNaN(Number(formData.take_profit))) return 'Take profit must be a number'
    if (formData.pnl !== '' && isNaN(Number(formData.pnl))) return 'P&L must be a number'

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
      // Set default values for empty fields to allow fast testing
      const submitData = {
        ...formData,
        pair: formData.pair.trim(), // Only required field
        entry_price: formData.entry_price === '' ? 0 : Number(formData.entry_price),
        stop_loss: formData.stop_loss === '' ? 0 : Number(formData.stop_loss),
        take_profit: formData.take_profit === '' ? 0 : Number(formData.take_profit),
        pnl: formData.pnl === '' ? 0 : Number(formData.pnl),
        setup_tag: formData.setup_tag === '' ? '' : formData.setup_tag,
        notes: formData.notes === '' ? '' : formData.notes,
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

  const inputClass = 'w-full bg-[#0A0C16] border border-[#1E2844] text-[#DDE4F0] placeholder:text-[#4A5880] rounded-lg px-4 py-3 text-sm shadow-inner shadow-black/20 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 focus:outline-none transition-colors'
  const labelClass = 'block text-xs font-medium text-[#7B8BB0] uppercase tracking-wider mb-2'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Pair */}
        <div className="flex flex-col gap-1">
          <label htmlFor="pair" className={labelClass}>
            Trading Pair
          </label>
          <input
            type="text"
            id="pair"
            name="pair"
            required
            value={formData.pair}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. BTCUSD, EURUSD, GOLD"
          />
        </div>

        {/* Direction */}
        <div className="flex flex-col gap-1">
          <label htmlFor="direction" className={labelClass}>
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            className={cn(inputClass, 'scheme-dark')}
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        {/* Entry Price */}
        <div className="flex flex-col gap-1">
          <label htmlFor="entry_price" className={labelClass}>
            Entry Price
          </label>
          <input
            type="number"
            id="entry_price"
            name="entry_price"
            step="0.01"
            value={formData.entry_price}
            onChange={handleChange}
            className={cn(inputClass, 'appearance-none')}
            placeholder="Optional"
          />
        </div>

        {/* Stop Loss */}
        <div className="flex flex-col gap-1">
          <label htmlFor="stop_loss" className={labelClass}>
            Stop Loss
          </label>
          <input
            type="number"
            id="stop_loss"
            name="stop_loss"
            step="0.01"
            value={formData.stop_loss}
            onChange={handleChange}
            className={cn(inputClass, 'appearance-none')}
            placeholder="Optional"
          />
        </div>

        {/* Take Profit */}
        <div className="flex flex-col gap-1">
          <label htmlFor="take_profit" className={labelClass}>
            Take Profit
          </label>
          <input
            type="number"
            id="take_profit"
            name="take_profit"
            step="0.01"
            value={formData.take_profit}
            onChange={handleChange}
            className={cn(inputClass, 'appearance-none')}
            placeholder="Optional"
          />
        </div>

        {/* P&L */}
        <div className="flex flex-col gap-1">
          <label htmlFor="pnl" className={labelClass}>
            P&L ($)
          </label>
          <input
            type="number"
            id="pnl"
            name="pnl"
            step="0.01"
            value={formData.pnl}
            onChange={handleChange}
            className={cn(inputClass, 'appearance-none')}
            placeholder="Optional"
          />
        </div>

        {/* Trade Date */}
        <div className="flex flex-col gap-1">
          <label htmlFor="trade_date" className={labelClass}>
            Trade Date
          </label>
          <input
            type="date"
            id="trade_date"
            name="trade_date"
            value={formData.trade_date}
            onChange={handleChange}
            className={cn(inputClass, 'scheme-dark')}
          />
        </div>

        {/* Setup Tag */}
        <div className="flex flex-col gap-1">
          <label htmlFor="setup_tag" className={labelClass}>
            Setup Tag
          </label>
          <input
            type="text"
            id="setup_tag"
            name="setup_tag"
            value={formData.setup_tag}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. breakout, support bounce"
          />
        </div>

        {/* Screenshot Upload */}
        <div className="col-span-full flex flex-col gap-1">
          <label className={labelClass}>
            Trade Screenshot (Optional)
          </label>
          <div className="flex flex-col gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Upload button or preview */}
            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 bg-[#0A0C16] border border-[#1E2844] hover:border-[#4361EE]/40 rounded-lg text-sm text-[#7B8BB0] hover:text-[#DDE4F0] transition-colors w-fit"
              >
                <Image className="h-4 w-4" />
                <span>Upload Screenshot</span>
              </button>
            ) : (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Trade screenshot preview"
                  className="h-32 w-auto rounded-lg border border-[#1A2540] object-cover"
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

            {/* File info */}
            {formData.screenshot && (
              <p className="text-[10px] text-[#4A5880]">
                {formData.screenshot.name} ({(formData.screenshot.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className={cn(inputClass, 'min-h-30 py-4 resize-none')}
          placeholder="Trade notes, analysis, lessons learned..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
          <p className="text-sm text-emerald-400">Trade saved successfully!</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-[#7B8BB0] hover:text-[#DDE4F0] border border-[#1A2540] hover:border-[#4361EE]/30 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'flex-1 px-6 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:scale-[1.01]',
            loading
              ? 'bg-[#1A2540] cursor-not-allowed text-[#4A5880]'
              : 'bg-[#4361EE] hover:bg-[#3451D1]'
          )}
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
