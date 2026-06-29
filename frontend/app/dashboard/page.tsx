'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
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

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.dispatchEvent(new Event('authChanged'));

    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
              Playio.az
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold transition hover:bg-red-700 sm:w-auto"
          >
            Çıxış
          </button>
        </div>

        {user && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8">
            <h2 className="text-2xl font-bold">Profil</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-800 p-4">
                <p className="text-sm text-zinc-500">Username</p>
                <p className="mt-1 break-words text-lg font-semibold">
                  {user.username}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-800 p-4">
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-1 break-all text-lg font-semibold">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-800 p-4 sm:col-span-2">
                <p className="text-sm text-zinc-500">Role</p>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}