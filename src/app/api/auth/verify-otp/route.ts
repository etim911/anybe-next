import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA2f4c5bc238c2d60ca104e10d466b0e10';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://ekdxtohgrlzugluzmqpb.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy_key';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await request.json();
    const { phone, code } = body;
    
    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Phone and code are required' }, { status: 400 });
    }

    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials');
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    
    const verificationCheck = await client.verify.v2.services(verifySid)
      .verificationChecks
      .create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      const normalizedPhone = phone.startsWith('+') ? phone : '+' + phone.replace(/\D/g, '');
      
      const { data, error } = await supabase
        .from('guests')
        .upsert({ phone: normalizedPhone }, { onConflict: 'phone' })
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to save guest record' }, { status: 500 });
      }

      return NextResponse.json({ success: true, guest: data });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid verification code' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to verify OTP' }, { status: 500 });
  }
}
