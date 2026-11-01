# Kisii Meet Hub (Supabase Version)

Real dating / social discovery platform for Kisii & Nyamira.

## Features

- **Supabase Auth** — Real Register & Login
- **Supabase Database** — Profiles + Unlocks
- **Supabase Storage** — Profile photo uploads
- **Real Paystack** — M-Pesa & Card payments
- Unlock phone number after successful payment
- Landing page with preview (auth required for actions)
- Discover / Swipe interface
- Unlocked numbers list with WhatsApp & Call

## Quick Start

### 1. Create Supabase Project

Follow the detailed guide in `SUPABASE_SETUP.md`

### 2. Install & Run

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase + Paystack keys
npm run dev
```

### 3. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_SECRET_KEY=sk_test_9f5b40a1e1fe26803cd5bd804f4ed2889b3b1892
PAYSTACK_PUBLIC_KEY=pk_test_b351dd91aec80e8623d6c5229fd1d898d9574bfc
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_b351dd91aec80e8623d6c5229fd1d898d9574bfc
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deploy to Vercel

1. Push this project to GitHub
2. Import into Vercel
3. Add all environment variables
4. Deploy

After deploy, set Paystack Webhook URL to:
```
https://your-app.vercel.app/api/paystack/webhook
```

## Database Tables

See `SUPABASE_SETUP.md` for the full SQL.

Main tables:
- `profiles`
- `unlocks`

Storage bucket: `avatars`
