import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { phone, firstName, lastName, dob } = await request.json();
    if (!phone || !firstName || !lastName || !dob) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\\D/g, '');

    const { data, error } = await supabase
      .from('guests')
      .update({ first_name: firstName, last_name: lastName, dob })
      .eq('phone', normalizedPhone)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, guest: data });
  } catch (error: unknown) {
    console.error('Update Profile Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}