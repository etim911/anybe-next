import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { normalizePhone } from '@/lib/phone';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const verifySid = process.env.TWILIO_VERIFY_SID;
    if (!verifySid) {
      return NextResponse.json({ success: false, error: 'Server configuration error: missing TWILIO_VERIFY_SID' }, { status: 500 });
    }

    const normalizedPhone = normalizePhone(phone);

    const verification = await twilioClient.verify.v2.services(verifySid)
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