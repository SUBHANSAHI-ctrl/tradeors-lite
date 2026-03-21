export type TradeDirection = 'long' | 'short'

export interface Trade {
  id: string
  user_id: string
  pair: string
  direction: TradeDirection
  entry_price: number
  stop_loss: number
  take_profit: number
  pnl: number
  setup_tag: string
  notes: string
  trade_date: string
  created_at: string
  screenshot_url?: string | null
}

export interface TradeFormData {
  pair: string
  direction: TradeDirection
  entry_price: number | ''
  stop_loss: number | ''
  take_profit: number | ''
  pnl: number | ''
  setup_tag: string
  notes: string
  trade_date: string
  screenshot?: File | null
  screenshot_url?: string | null
}

export interface PerformanceMetrics {
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  totalPnL: number
  averageTrade: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  bestPerformingPair: string
  worstPerformingPair: string
}

export interface PairPerformance {
  pair: string
  trades: number
  wins: number
  losses: number
  winRate: number
  totalPnL: number
  averagePnL: number
}