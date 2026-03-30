import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*, guestlists(count)');

    if (eventsError) {
      console.error('Supabase Events Error:', eventsError);
      return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enhancedEvents = events.map((event: any) => {
      const registered = event.guestlists?.[0]?.count || 0;
      const capacity = event.capacity || 0;
      const available = Math.max(0, capacity - registered);
      return {
        ...event,
        registered,
        available
      };
    });

    return NextResponse.json({ success: true, events: enhancedEvents });
  } catch (error: unknown) {
    console.error('Events GET Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}