'use client';

import { useEffect, useState } from 'react';
import {
  createTournament,
  getTeams,
  getTournamentEntries,
  getTournaments,
  joinTournament,
} from '../../lib/api';

type Team = {
  id: string;
  name: string;
  game: string;
};

type Tournament = {
  id: string;
  title: string;
  game: string;
  prizePool: number;
  maxTeams: number;
  status: string;
};

type TournamentEntry = {
  id: string;
  tournament: Tournament;
  team: Team;
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [entries, setEntries] = useState<TournamentEntry[]>([]);

  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [maxTeams, setMaxTeams] = useState(16);
  const [selectedTeamId, setSelectedTeamId] = useState('');

  async function loadData() {
    setTournaments(await getTournaments());
    setTeams(await getTeams());
    setEntries(await getTournamentEntries());
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();

    await createTournament({
      title,
      game,
      prizePool,
      maxTeams,
    });

    setTitle('');
    setGame('');
    setPrizePool(0);
    setMaxTeams(16);

    await loadData();
  }

  async function handleJoinTournament(tournamentId: string) {
    if (!selectedTeamId) {
      alert('Əvvəl komanda seç');
      return;
    }

    const result = await joinTournament({
      tournamentId,
      teamId: selectedTeamId,
    });

    if (result.message) {
      alert(result.message);
      return;
    }

    alert('Komanda turnirə qoşuldu!');
    await loadData();
  }

  function getJoinedTeams(tournamentId: string) {
    return entries.filter((entry) => entry.tournament.id === tournamentId);
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold">Playio Tournaments</h1>

        <form
          onSubmit={handleCreateTournament}
          className="mb-8 space-y-4 rounded-xl bg-zinc-900 p-6"
        >
          <input
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Turnirin adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Oyun"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          />

          <input
            type="number"
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Mükafat fondu"
            value={prizePool}
            onChange={(e) => setPrizePool(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full rounded-lg bg-zinc-800 p-3"
            placeholder="Maksimum komanda sayı"
            value={maxTeams}
            onChange={(e) => setMaxTeams(Number(e.target.value))}
          />

          <button className="rounded-lg bg-violet-600 px-6 py-3 font-bold">
            Turnir yarat
          </button>
        </form>

        <div className="mb-8 rounded-xl bg-zinc-900 p-6">
          <label className="mb-2 block text-sm text-zinc-400">
            Turnirə qoşulacaq komandanı seç
          </label>

          <select
            className="w-full rounded-lg bg-zinc-800 p-3"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            <option value="">Komanda seç</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} — {team.game}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {tournaments.map((tournament) => {
            const joinedTeams = getJoinedTeams(tournament.id);

            return (
              <div key={tournament.id} className="rounded-xl bg-zinc-900 p-5">
                <h2 className="text-2xl font-bold">{tournament.title}</h2>

                <p>🎮 Oyun: {tournament.game}</p>
                <p>💰 Mükafat: {tournament.prizePool} AZN</p>
                <p>
                  👥 Komandalar: {joinedTeams.length}/{tournament.maxTeams}
                </p>
                <p>📌 Status: {tournament.status}</p>

                <button
                  onClick={() => handleJoinTournament(tournament.id)}
                  className="mt-4 rounded-lg bg-violet-600 px-5 py-2 font-bold"
                >
                  Seçilmiş komandanı qoş
                </button>

                <div className="mt-4">
                  <h3 className="font-bold">Qoşulan komandalar:</h3>

                  {joinedTeams.length === 0 ? (
                    <p className="text-zinc-400">Hələ komanda yoxdur</p>
                  ) : (
                    <ul className="mt-2 list-disc pl-5 text-zinc-300">
                      {joinedTeams.map((entry) => (
                        <li key={entry.id}>{entry.team.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}