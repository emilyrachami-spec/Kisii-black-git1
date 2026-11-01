'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '',
    dob: '', gender: '', looking: 'Relationship', location: 'Kisii Town'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.password || !form.dob || !form.gender) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Calculate age
      const age = Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        setError('You must be 18 or older');
        setLoading(false);
        return;
      }

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone.replace(/\s/g, ''),
        gender: form.gender,
        looking_for: form.looking,
        location: form.location,
        age: age,
        bio: ''
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      router.push('/discover');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-5 pt-10 pb-3">
        <Link href="/" className="inline-block mb-4 p-2 -ml-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-gray-500 text-sm mt-1">Join Kisii Meet Hub</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex-1 space-y-3 overflow-y-auto pb-10">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (M-Pesa) *</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
            placeholder="07XX XXX XXX"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          <input name="dob" type="date" value={form.dob} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select name="gender" value={form.gender} onChange={handleChange} required
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
          <select name="looking" value={form.looking} onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
            <option>Relationship</option>
            <option>Friendship</option>
            <option>Something casual</option>
            <option>Not sure yet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select name="location" value={form.location} onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
            <option>Kisii Town</option>
            <option>Nyamira</option>
            <option>Keumbu</option>
            <option>Daraja Mbili</option>
            <option>Suneka</option>
            <option>Other (Kisii County)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Already have an account? <Link href="/login" className="text-primary-600 font-semibold">Log in</Link>
        </p>
      </form>
    </div>
  );
}
