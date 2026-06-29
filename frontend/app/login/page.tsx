'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = await loginUser({ email, password });

    if (data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Giriş uğurlu oldu!');
      router.push('/dashboard');
    } else {
      alert('Email və ya şifrə yanlışdır');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-zinc-900 p-6 space-y-4">
        <h1 className="text-3xl font-bold">Playio Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-zinc-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifrə"
          className="w-full p-3 rounded-lg bg-zinc-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full p-3 rounded-lg bg-violet-600 font-bold">
          Daxil ol
        </button>
      </form>
    </main>
  );
}