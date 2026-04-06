import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { eventId, ticketTierId, userId } = paymentIntent.metadata;

    if (!eventId || !userId) {
      console.error('Missing required metadata on payment_intent', paymentIntent.metadata);
      return new NextResponse('Missing metadata', { status: 400 });
    }

    const { error } = await supabase
      .from('event_attendees')
      .insert({
        event_id: eventId,
        ticket_tier_id: ticketTierId || null,
        user_id: userId,
        payment_intent_id: paymentIntent.id,
        payment_status: 'paid',
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase insert error:', error.message);
      return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
    }
  }

  return new NextResponse('Success', { status: 200 });
}
