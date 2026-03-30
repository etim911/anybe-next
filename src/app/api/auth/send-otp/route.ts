import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA2f4c5bc238c2d60ca104e10d466b0e10';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone is required' }, { status: 400 });
    }

    if (!accountSid || !authToken) {
       console.error('Missing Twilio credentials');
       return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    const verification = await client.verify.v2.services(verifySid)
      .verifications
      .create({ to: phone, channel: 'sms' });

    return NextResponse.json({ success: true, message: verification.status });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
