'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { createTeam, getTeams } from '../../lib/api';

type Team = {
  id: string;
  name: string;
  game: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);

  async function loadTeams() {
    try {
      setLoadingTeams(true);
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      toast.error('Komandalar yüklənmədi');
      console.error(error);
    } finally {
      setLoadingTeams(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !game.trim()) {
      toast.error('Komanda adı və oyun boş ola bilməz');
      return;
    }

    setLoading(true);

    try {
      await createTeam({ name, game });

      toast.success('Komanda yaradıldı!');

      setName('');
      setGame('');

      await loadTeams();
    } catch (error) {
      toast.error('Komanda yaradılmadı');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            Playio.az
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Teams
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Komandanı yarat və turnirlərdə iştirak etməyə hazırlaş.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8"
        >
          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Komanda adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Oyun: CS2, Valorant, PUBG..."
            value={game}
            onChange={(e) => setGame(e.target.value)}
            disabled={loading}
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Komanda yaradılır...' : 'Komanda yarat'}
          </button>
        </form>

        {loadingTeams ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Komandalar yüklənir...
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Hələ heç bir komanda yoxdur.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h2 className="break-words text-2xl font-bold">
                  {team.name}
                </h2>

                <p className="mt-2 break-words text-zinc-400">
                  Oyun: {team.game}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}