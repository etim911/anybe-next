import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const { eventId, ticketTierId } = await req.json();

    if (!eventId || !ticketTierId) {
      return NextResponse.json({ error: 'Missing eventId or ticketTierId' }, { status: 400 });
    }

    // Fetch the real price from Supabase
    const { data: ticketTier, error } = await supabaseServer
      .from('ticket_tiers')
      .select('price')
      .eq('id', ticketTierId)
      .eq('event_id', eventId)
      .single();

    if (error || !ticketTier) {
      console.error('Error fetching ticket tier:', error);
      return NextResponse.json({ error: 'Ticket tier not found or invalid' }, { status: 404 });
    }

    const price = ticketTier.price;
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Invalid price on ticket tier' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY || '';
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });

    // Create a PaymentIntent with the order amount in cents
    const amountInCents = Math.round(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        eventId,
        ticketTierId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('Payment intent creation failed:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
