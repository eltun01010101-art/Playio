'use client';

import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        window.dispatchEvent(new Event('authChanged'));

        toast.success('Giriş uğurlu oldu!');
        router.push('/dashboard');
      } else {
        toast.error('Email və ya şifrə yanlışdır');
      }
    } catch (error) {
      toast.error('Giriş zamanı xəta baş verdi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl sm:p-8"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
              Playio.az
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Daxil ol
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Hesabına daxil ol və Playio dashboard-a keç.
            </p>
          </div>

          <input
            type="email"
            placeholder="Email"
            disabled={loading}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifrə"
            disabled={loading}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 p-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Daxil olunur...' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </main>
  );
}