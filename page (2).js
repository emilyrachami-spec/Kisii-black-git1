'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/discover');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-700">
        <div className="text-white text-lg font-semibold">Kisii Meet Hub</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative h-[48vh] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-36 h-36 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-12 right-4 w-48 h-48 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Kisii Meet Hub</h1>
          <p className="text-primary-100 text-lg font-medium mt-1">Connect. Unlock. Meet.</p>
          <p className="mt-2 text-sm text-primary-200 max-w-xs">Real people in Kisii, Nyamira & surrounding areas</p>
        </div>
      </div>

      <div className="flex-1 -mt-5 relative z-20 px-5 pb-6">
        <div className="bg-white rounded-3xl shadow-lg p-5">
          <p className="text-center text-gray-600 text-sm mb-4">
            Preview the experience. Sign up when you want to connect.
          </p>
          <Link href="/discover" className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-2xl text-center mb-3">
            Explore Kisii Meet Hub
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-sm text-center">
              Log In
            </Link>
            <Link href="/register" className="bg-primary-50 text-primary-700 font-semibold py-3 rounded-xl text-sm text-center border border-primary-200">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
