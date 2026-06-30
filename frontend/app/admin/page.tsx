'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTeams, getTournaments } from '../../lib/api';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [teamsCount, setTeamsCount] = useState(0);
  const [tournamentsCount, setTournamentsCount] = useState(0);

  useEffect(() => {
    async function loadAdminData() {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);

      const teams = await getTeams();
      const tournaments = await getTournaments();

      setTeamsCount(teams.length);
      setTournamentsCount(tournaments.length);
    }

    loadAdminData();
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            Playio.az
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Admin Panel
          </h1>

          <p className="mt-2 text-zinc-400">
            Platformanın əsas statistikalarını idarə et.
          </p>
        </div>

        {user && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8">
            <p className="text-zinc-400">Admin</p>
            <h2 className="mt-1 text-2xl font-black">{user.username}</h2>
            <p className="break-all text-zinc-500">{user.email}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Komandalar</p>
            <h3 className="mt-2 text-4xl font-black">{teamsCount}</h3>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Turnirlər</p>
            <h3 className="mt-2 text-4xl font-black">{tournamentsCount}</h3>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Status</p>
            <h3 className="mt-2 text-2xl font-black text-emerald-400">
              Active
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
}