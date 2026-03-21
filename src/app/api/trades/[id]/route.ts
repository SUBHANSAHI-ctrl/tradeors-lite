import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { TradeFormData } from '@/types/trade'
import { uploadTradeScreenshot } from '@/lib/storage'

// GET: Fetch a single trade by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const { data: trade, error } = await serverSupabase
      .from('trades')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(trade)
  } catch (error) {
    console.error('Error fetching trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT: Update a trade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    // Extract screenshot file if present, but don't include it in the update payload
    const { screenshot, ...tradeData } = body

    const { data: existingTrade, error: checkError } = await serverSupabase
      .from('trades')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingTrade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    // Handle screenshot upload if provided
    let screenshotUrl: string | null = null
    if (screenshot) {
      console.log('Uploading screenshot for trade update:', id)
      const uploadResult = await uploadTradeScreenshot(screenshot, user.id, id)
      
      if (uploadResult.error) {
        console.error('Screenshot upload error during update:', uploadResult.error)
        // Continue with update but don't fail the entire operation
      } else {
        screenshotUrl = uploadResult.url
      }
    }

    // Build update payload with screenshot URL if available
    const updatePayload = {
      ...tradeData,
      ...(screenshotUrl !== null && { screenshot_url: screenshotUrl })
    }

    const { data: trade, error } = await serverSupabase
      .from('trades')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(trade)
  } catch (error) {
    console.error('Error updating trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a trade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const { data: existingTrade, error: checkError } = await serverSupabase
      .from('trades')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingTrade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    const { error } = await serverSupabase
      .from('trades')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Trade deleted successfully' })
  } catch (error) {
    console.error('Error deleting trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}