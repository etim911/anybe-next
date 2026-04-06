import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const { eventId, name, email } = await request.json();

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !email.includes('@') || email.length > 255) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('waitlist')
      .insert([
        { event_id: eventId, name, email }
      ]);

    if (error) {
      console.error('Waitlist insertion error:', error);
      // Handle unique constraint violation (code 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already on the waitlist for this event' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully joined waitlist' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Waitlist API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
