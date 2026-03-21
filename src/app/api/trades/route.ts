import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { TradeFormData } from '@/types/trade'

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

    const requiredFields = [
      'pair',
      'direction',
      'entry_price',
      'stop_loss',
      'take_profit',
      'pnl',
      'setup_tag',
      'trade_date',
    ] as const

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ''
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const insertPayload = {
      pair: body.pair,
      direction: body.direction,
      entry_price: Number(body.entry_price),
      stop_loss: Number(body.stop_loss),
      take_profit: Number(body.take_profit),
      pnl: Number(body.pnl),
      setup_tag: body.setup_tag,
      notes: body.notes || '',
      trade_date: body.trade_date,
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