import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = 'VA2f4c5bc238c2d60ca104e10d466b0e10';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // Normalize phone to E.164
    const normalizedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\\D/g, '')}`;

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
      .create({ to: normalizedPhone, channel: 'sms' });

    return NextResponse.json({ success: true, message: verification.status });
  } catch (error: unknown) {
    console.error('Send OTP Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}