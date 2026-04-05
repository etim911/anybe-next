import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, eventId, ticketTierId } = await request.json();

    if (!userId || !eventId || !ticketTierId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, eventId, ticketTierId' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call the secure RPC function to prevent race conditions
    // This executes as a single PostgreSQL transaction
    const { data, error } = await supabase.rpc('reserve_ticket_tier', {
      p_user_id: userId,
      p_event_id: eventId,
      p_ticket_tier_id: ticketTierId
    });

    if (error) {
      console.error('Supabase RPC Error:', error);
      if (error.message.includes('sold out') || error.message.includes('Insufficient quantity')) {
        return NextResponse.json({ error: 'This ticket tier is completely sold out.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to reserve ticket. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket successfully reserved.',
      reservation: data
    }, { status: 200 });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout.' },
      { status: 500 }
    );
  }
}
