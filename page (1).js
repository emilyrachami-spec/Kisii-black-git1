'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/discover');
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 pt-12 pb-6">
        <Link href="/" className="inline-block mb-6 p-2 -ml-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="text-gray-500 mt-1">Log in to your Kisii Meet Hub account</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="you@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Your password" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl">
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-500 pt-3">
          Don’t have an account? <Link href="/register" className="text-primary-600 font-semibold">Create one</Link>
        </p>
      </form>
    </div>
  );
}
