'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const demoProfiles = [
  {id:'p1',name:'Faith Kerubo',age:24,location:'Kisii Town',distance:'3 km',bio:'Nurse by day, adventure seeker by weekend.',photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&crop=face',phone:'0712345678'},
  {id:'p2',name:'Brian Omwenga',age:27,location:'Nyamira',distance:'12 km',bio:'Software developer. Coffee addict.',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face',phone:'0723456789'},
  {id:'p3',name:'Mercy Moraa',age:23,location:'Kisii',distance:'5 km',bio:'Teacher • Book lover • Always smiling.',photo:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face',phone:'0745678901'},
  {id:'p4',name:'Dennis Nyabuto',age:29,location:'Keumbu',distance:'8 km',bio:'Entrepreneur. Love gym and Sunday drives.',photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&crop=face',phone:'0701234567'},
];

export default function DiscoverPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [index, setIndex] = useState(0);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Allow preview but actions will require auth
        setUser(null);
      } else {
        setUser(session.user);
      }
    });
  }, []);

  const current = demoProfiles[index];

  async function handleUnlock() {
    if (!user) {
      router.push('/register');
      return;
    }
    if (!current || paying) return;
    setPaying(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          profileId: current.id,
          profileName: current.name,
          profilePhone: current.phone,
          profilePhoto: current.photo,
          amount: 15000
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not start payment');
        setPaying(false);
        return;
      }

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      alert('Network error');
      setPaying(false);
    }
  }

  function next() {
    if (!user) {
      router.push('/register');
      return;
    }
    setIndex(i => i + 1);
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">KM</div>
          <div>
            <h1 className="font-bold text-lg leading-none">Kisii Meet</h1>
            <p className="text-[10px] text-gray-400">Hub</p>
          </div>
        </div>
        <Link href={user ? '/profile' : '/register'} className="text-sm font-medium text-primary-600">
          {user ? 'Profile' : 'Sign Up'}
        </Link>
      </header>

      <main className="flex-1 px-4 pt-4">
        {!current ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-gray-700">You're all caught up!</p>
            <button onClick={() => setIndex(0)} className="mt-4 text-primary-600 font-semibold">Start over</button>
          </div>
        ) : (
          <>
            <div className="relative h-[460px] rounded-3xl overflow-hidden shadow-lg mb-4">
              <img src={current.photo} alt={current.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 profile-grad"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-2xl font-bold">{current.name}, {current.age}</h2>
                <p className="text-white/80 text-sm">{current.location} • {current.distance}</p>
                <p className="text-white/90 text-sm mt-2">{current.bio}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5">
              <button onClick={next} className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow flex items-center justify-center text-red-500">
                ✕
              </button>
              <button onClick={handleUnlock} disabled={paying}
                className="w-16 h-16 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-white text-2xl disabled:opacity-60">
                {paying ? '...' : '🔒'}
              </button>
              <button onClick={next} className="w-14 h-14 rounded-full bg-white border-2 border-primary-200 shadow flex items-center justify-center text-primary-600">
                ♥
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              {user ? 'Tap lock to Unlock Number (KES 150)' : 'Sign up to unlock numbers'}
            </p>
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t px-2 py-2 flex justify-around">
        <Link href="/discover" className="flex flex-col items-center py-1.5 px-4 text-primary-600 text-xs font-medium">Discover</Link>
        <Link href={user ? '/unlocked' : '/register'} className="flex flex-col items-center py-1.5 px-4 text-gray-400 text-xs font-medium">Unlocked</Link>
        <Link href={user ? '/profile' : '/register'} className="flex flex-col items-center py-1.5 px-4 text-gray-400 text-xs font-medium">Profile</Link>
      </nav>
    </div>
  );
}
