import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // In a real app, this would integrate with Twilio to send an SMS
        // For this implementation effectively utilizing Demo Mode:

        // Check if we allow sending OTPs (could rate limit here)
        console.log(`Sending OTP to ${phone}`);

        // Return success
        // In production we would return { success: true }
        // but in development we can even return the OTP for convenience if we wanted

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully. (Demo: use 123456)'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
