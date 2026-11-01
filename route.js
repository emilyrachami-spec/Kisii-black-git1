import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const body = await req.text();
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    const signature = req.headers.get('x-paystack-signature');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount } = event.data;
      const { user_id, profile_id, profile_name, profile_phone, profile_photo, type } = metadata || {};

      if (type === 'unlock' && user_id && profile_id) {
        // Use service role to insert unlock
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Check if already unlocked
        const { data: existing } = await supabase
          .from('unlocks')
          .select('id')
          .eq('user_id', user_id)
          .eq('profile_id', profile_id)
          .maybeSingle();

        if (!existing) {
          await supabase.from('unlocks').insert({
            user_id,
            profile_id,
            profile_name,
            profile_phone,
            profile_photo,
            amount: amount / 100,
            reference
          });
          console.log(`Unlock successful: ${user_id} → ${profile_id}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
