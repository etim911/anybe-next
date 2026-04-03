import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/phone';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json();
    if (!firstName || !lastName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('guest-token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized: missing token' }, { status: 401 });
    }

    let decoded: string | jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    } catch {
      return NextResponse.json({ success: false, error: 'Unauthorized: invalid token' }, { status: 401 });
    }

    if (!decoded || typeof decoded === 'string' || !decoded.phone) {
      return NextResponse.json({ success: false, error: 'Unauthorized: token missing phone number' }, { status: 401 });
    }

    const normalizedPhone = normalizePhone(decoded.phone);

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
