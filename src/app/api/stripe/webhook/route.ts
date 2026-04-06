import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature error:', err)
    return new Response('Webhook Error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('🔥 FULL SESSION:', session)

    const userId = session.metadata?.user_id

    console.log('👤 USER ID:', userId)

    if (!userId) {
      console.error('❌ No user_id in metadata')
      return new Response('Missing user_id', { status: 400 })
    }

    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('user_id', userId)

    if (error) {
      console.error('❌ Supabase error:', error)
      return new Response('DB error', { status: 500 })
    }

    console.log('✅ User upgraded to PRO:', userId)
  }

  return new Response('OK', { status: 200 })
}