'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CmsLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/cms/dashboard');
      } else {
        setError('Invalid password.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-2xl font-bold text-[#31ecff] mb-8">CMS Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent border border-[#31ecff] border-opacity-30 text-[#ccdbe0] text-sm px-4 py-3 rounded focus:outline-none focus:border-opacity-100 placeholder-[#ccdbe0] placeholder-opacity-40"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#31ecff] bg-opacity-20 text-[#31ecff] font-semibold py-3 rounded hover:bg-opacity-30 transition-all duration-150 disabled:opacity-40"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
