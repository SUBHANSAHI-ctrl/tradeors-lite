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

-- Create profiles table for subscription system
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT DEFAULT 'free' NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for profiles table
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table with proper security

-- 1. Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Users cannot update sensitive subscription fields
-- This policy prevents updates to plan, stripe_customer_id, stripe_subscription_id
CREATE POLICY "Users cannot update subscription fields" ON profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (
    -- Only allow updates if sensitive fields are not being changed
    OLD.plan = NEW.plan AND
    OLD.stripe_customer_id = NEW.stripe_customer_id AND
    OLD.stripe_subscription_id = NEW.stripe_subscription_id
  );

-- 3. Service role can update all fields (for server-side subscription management)
-- This policy allows service role to update subscription fields
CREATE POLICY "Service role can update all profile fields" ON profiles
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- Create updated_at trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Backfill existing users with free plan
INSERT INTO profiles (user_id, plan)
SELECT id, 'free'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, plan)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample data (optional - remove in production)
-- INSERT INTO trades (user_id, pair, direction, entry_price, stop_loss, take_profit, pnl, setup_tag, notes, trade_date)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000000', 'BTCUSD', 'long', 45000.00, 44000.00, 47000.00, 1500.00, 'breakout', 'Clean breakout above resistance', '2024-01-15'),
--   ('00000000-0000-0000-0000-000000000000', 'EURUSD', 'short', 1.0850, 1.0900, 1.0750, -250.00, 'liquidity sweep', 'Stop loss hit on news spike', '2024-01-16'),
--   ('00000000-0000-0000-0000-000000000000', 'GOLD', 'long', 2025.50, 2015.00, 2050.00, 850.00, 'support bounce', 'Perfect bounce off daily support', '2024-01-17');