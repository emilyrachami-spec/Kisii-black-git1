import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { profileId, profileName, profilePhone, profilePhoto, amount = 15000 } = await req.json();

    // Get user from Authorization header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email || `${user.id}@kisimeethub.local`,
        amount: amount, // in kobo (KES 150 = 15000)
        currency: 'KES',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/unlocked?success=1`,
        metadata: {
          user_id: user.id,
          profile_id: profileId,
          profile_name: profileName,
          profile_phone: profilePhone,
          profile_photo: profilePhoto,
          type: 'unlock'
        },
        channels: ['mobile_money', 'card', 'bank']
      })
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Payment init failed' }, { status: 400 });
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference
    });
  } catch (err) {
    console.error('Paystack init error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
