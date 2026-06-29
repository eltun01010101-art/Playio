'use client';

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

  async function loadTeams() {
    const data = await getTeams();
    setTeams(data);
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createTeam({ name, game });

    setName('');
    setGame('');

    await loadTeams();
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
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Komanda adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Oyun: CS2, Valorant, PUBG..."
            value={game}
            onChange={(e) => setGame(e.target.value)}
          />

          <button className="w-full rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 sm:w-auto">
            Komanda yarat
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <h2 className="break-words text-2xl font-bold">
                {team.name}
              </h2>

              <p className="mt-2 text-zinc-400">
                Oyun: {team.game}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}