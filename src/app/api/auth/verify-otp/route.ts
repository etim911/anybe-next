import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { normalizePhone } from '@/lib/phone';
import jwt from 'jsonwebtoken';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;
    
    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Phone and code are required' }, { status: 400 });
    }

    const verifySid = process.env.TWILIO_VERIFY_SID;
    if (!verifySid) {
      return NextResponse.json({ success: false, error: 'Server configuration error: missing TWILIO_VERIFY_SID' }, { status: 500 });
    }

    const normalizedPhone = normalizePhone(phone);
    
    const verificationCheck = await twilioClient.verify.v2.services(verifySid)
      .verificationChecks
      .create({ to: normalizedPhone, code });

    if (verificationCheck.status === 'approved') {
      const { data, error } = await supabase
        .from('guests')
        .upsert({ phone: normalizedPhone }, { onConflict: 'phone' })
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save guest record' }, { status: 500 });
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'anybe-dev-secret-change-in-prod';
      
      const token = jwt.sign(
        { guestId: data.id, phone: normalizedPhone },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      const response = NextResponse.json({ success: true, guest: data });
      response.cookies.set('guest-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid verification code' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}