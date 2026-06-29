'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
          Profil yüklənir...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            Playio.az
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Profil
          </h1>

          <p className="mt-2 text-zinc-400">
            Hesab məlumatların və oyunçu profilin.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="h-28 bg-gradient-to-r from-violet-700 via-zinc-900 to-cyan-700" />

          <div className="p-5 sm:p-8">
            <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-zinc-900 bg-violet-600 text-5xl font-black shadow-xl">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="break-words text-3xl font-black">
                  {user.username}
                </h2>

                <p className="mt-1 break-all text-zinc-400">
                  {user.email}
                </p>

                <p className="mt-3 inline-flex rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold capitalize text-zinc-300">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-800 p-4">
                <p className="text-sm text-zinc-500">User ID</p>
                <p className="mt-1 break-all text-sm text-zinc-300">
                  {user.id}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-800 p-4">
                <p className="text-sm text-zinc-500">Status</p>
                <p className="mt-1 font-bold text-emerald-400">
                  Aktiv
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}