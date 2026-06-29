'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await registerUser({ username, email, password });

      const loginData = await loginUser({ email, password });

      if (loginData.accessToken) {
        localStorage.setItem('token', loginData.accessToken);
        localStorage.setItem('user', JSON.stringify(loginData.user));

        window.dispatchEvent(new Event('authChanged'));

        alert('Qeydiyyat uğurlu oldu!');
        router.push('/dashboard');
      } else {
        alert('Qeydiyyat oldu, amma avtomatik giriş alınmadı.');
        router.push('/login');
      }
    } catch (error) {
      alert('Xəta baş verdi');
      console.error(error);
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
              Qeydiyyat
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Komanda yaratmaq və turnirlərə qoşulmaq üçün hesab yarat.
            </p>
          </div>

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="İstifadəçi adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Şifrə"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 p-3 font-bold transition hover:bg-violet-700"
          >
            Qeydiyyatdan keç
          </button>
        </form>
      </div>
    </main>
  );
}