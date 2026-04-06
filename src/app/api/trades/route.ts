import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { TradeFormData } from '@/types/trade'
import { Profile } from '@/types/profile'
import { getPlanLimits } from '@/config/planLimits'

// GET: Fetch all trades for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const serverSupabase = createServerSupabaseClient(token)

    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: trades, error } = await serverSupabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('trade_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(trades)
  } catch (error) {
    console.error('GET /api/trades error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new trade
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const serverSupabase = createServerSupabaseClient(token)

    const {
      data: { user },
      error: authError,
    } = await serverSupabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: TradeFormData = await request.json()

    // Minimal validation - only pair is required
    if (!body.pair || body.pair.trim() === '') {
      console.error('Missing required field: pair')
      return NextResponse.json(
        { error: 'Trading pair is required' },
        { status: 400 }
      )
    }

    // Subscription enforcement: Check user's plan and trade limits
    try {
      // Fetch user's profile to get their subscription plan
      const { data: profile, error: profileError } = await serverSupabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile) {
        console.error('Failed to fetch user profile:', profileError)
        return NextResponse.json(
          { error: 'Failed to verify subscription status' },
          { status: 500 }
        )
      }

      const userProfile = profile as Profile

      // Check trade limits based on user's subscription plan
      if (userProfile.plan === 'free') {
        // Get plan limits for the user's current plan
        const limits = getPlanLimits(userProfile.plan)
        
        // Count current trades for the user
        const { count, error: countError } = await serverSupabase
          .from('trades')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (countError) {
          console.error('Failed to count user trades:', countError)
          return NextResponse.json(
            { error: 'Failed to verify trade limits' },
            { status: 500 }
          )
        }

        const currentTradeCount = count || 0

        if (currentTradeCount >= limits.maxTrades) {
          return NextResponse.json(
            { 
              error: 'Free plan limit reached. Upgrade to Pro to add more trades.',
              currentCount: currentTradeCount,
              maxAllowed: limits.maxTrades,
              suggestedAction: 'upgrade'
            },
            { status: 403 }
          )
        }

        console.log(`Free plan user has ${currentTradeCount}/${limits.maxTrades} trades`)
      }

      console.log(`User plan: ${userProfile.plan}, proceeding with trade creation`)
    } catch (subscriptionError) {
      console.error('Subscription enforcement error:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to verify subscription status' },
        { status: 500 }
      )
    }

    // Create payload with defaults for empty fields
    const insertPayload = {
      pair: body.pair.trim(),
      direction: body.direction || 'long',
      entry_price: body.entry_price !== undefined && body.entry_price !== '' ? Number(body.entry_price) : 0,
      stop_loss: body.stop_loss !== undefined && body.stop_loss !== '' ? Number(body.stop_loss) : 0,
      take_profit: body.take_profit !== undefined && body.take_profit !== '' ? Number(body.take_profit) : 0,
      pnl: body.pnl !== undefined && body.pnl !== '' ? Number(body.pnl) : 0,
      setup_tag: body.setup_tag || '',
      notes: body.notes || '',
      trade_date: body.trade_date || new Date().toISOString().split('T')[0],
      screenshot_url: body.screenshot_url || null,
    }

    console.log('POST /api/trades - insertPayload:', insertPayload)

    const { data: trade, error } = await serverSupabase
      .from('trades')
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      console.error('POST /api/trades insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('POST /api/trades unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}