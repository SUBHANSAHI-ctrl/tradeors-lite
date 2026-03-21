-- Enable Row Level Security
ALTER DATABASE postgres SET app.settings.jwt_secret TO 'your-jwt-secret-here';

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pair TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('long', 'short')) NOT NULL,
  entry_price DECIMAL(10, 6) NOT NULL,
  stop_loss DECIMAL(10, 6) NOT NULL,
  take_profit DECIMAL(10, 6) NOT NULL,
  pnl DECIMAL(10, 2) NOT NULL,
  setup_tag TEXT NOT NULL,
  notes TEXT,
  trade_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on trades table
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own trades
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own trades
CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own trades
CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own trades
CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_pair ON trades(pair);
CREATE INDEX idx_trades_trade_date ON trades(trade_date);
CREATE INDEX idx_trades_created_at ON trades(created_at);

-- Insert sample data (optional - remove in production)
-- INSERT INTO trades (user_id, pair, direction, entry_price, stop_loss, take_profit, pnl, setup_tag, notes, trade_date)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000000', 'BTCUSD', 'long', 45000.00, 44000.00, 47000.00, 1500.00, 'breakout', 'Clean breakout above resistance', '2024-01-15'),
--   ('00000000-0000-0000-0000-000000000000', 'EURUSD', 'short', 1.0850, 1.0900, 1.0750, -250.00, 'liquidity sweep', 'Stop loss hit on news spike', '2024-01-16'),
--   ('00000000-0000-0000-0000-000000000000', 'GOLD', 'long', 2025.50, 2015.00, 2050.00, 850.00, 'support bounce', 'Perfect bounce off daily support', '2024-01-17');