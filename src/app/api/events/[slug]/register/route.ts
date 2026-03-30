import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ slug: string }> } | { params: { slug: string } }
) {
  try {
    const { guestId, eventId } = await request.json();
    
    if (!guestId || !eventId) {
      return NextResponse.json({ success: false, error: 'Guest ID and Event ID are required' }, { status: 400 });
    }

    // Attempt to insert into guestlist
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: registration, error: regError } = await supabase
      .from('guestlists')
      .insert({
        guest_id: guestId,
        event_id: eventId,
        status: 'registered' // default status
      })
      .select()
      .single();

    if (regError) {
      // Check if it's a unique constraint violation (already registered)
      if (regError.code === '23505') {
        return NextResponse.json({ success: false, error: 'Already registered for this event' }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: 'Failed to register' }, { status: 500 });
    }

    // Try to get a pass if available
    let pass = null;
    const { data: passData, error: passError } = await supabase
      .from('passes')
      .select('*')
      .eq('event_id', eventId)
      .eq('guest_id', guestId)
      .single();

    if (!passError && passData) {
      pass = passData;
    }

    return NextResponse.json({ success: true, pass });
  } catch (error: unknown) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}