'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await registerUser({
        username,
        email,
        password,
      });

      alert('Qeydiyyat uğurlu oldu!');
    } catch (error) {
      alert('Xəta baş verdi');
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-zinc-900 p-6"
      >
        <h1 className="text-3xl font-bold">Playio Qeydiyyat</h1>

        <input
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          placeholder="İstifadəçi adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          placeholder="Şifrə"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 p-3 font-bold"
        >
          Qeydiyyatdan keç
        </button>
      </form>
    </main>
  );
}