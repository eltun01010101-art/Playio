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

    await createTeam({
      name,
      game,
    });

    setName('');
    setGame('');

    await loadTeams();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-bold">
          Playio Teams
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl bg-zinc-900 p-6"
        >
          <input
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Komanda adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Oyun (CS2, Valorant, PUBG...)"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          />

          <button
            className="rounded-lg bg-violet-600 px-6 py-3 font-bold"
          >
            Komanda yarat
          </button>
        </form>

        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl bg-zinc-900 p-5"
            >
              <h2 className="text-2xl font-bold">
                {team.name}
              </h2>

              <p className="text-zinc-400">
                Oyun: {team.game}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}