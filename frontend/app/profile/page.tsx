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

    setUser(JSON.parse(savedUser));
  }, [router]);

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
        Profil yüklənir...
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
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600 text-4xl font-black">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="break-words text-3xl font-black">
                {user.username}
              </h2>
              <p className="mt-1 break-all text-zinc-400">{user.email}</p>
              <p className="mt-2 inline-block rounded-full bg-zinc-800 px-4 py-2 text-sm capitalize text-zinc-300">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}