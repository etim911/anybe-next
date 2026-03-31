import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, firstName, lastName, email } = await request.json();
    if (!phone || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');

    const { data, error } = await supabase
      .from('guests')
      .update({ first_name: firstName, last_name: lastName, email: email || null })
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
