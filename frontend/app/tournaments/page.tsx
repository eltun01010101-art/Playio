'use client';

import toast from 'react-hot-toast';
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

  const [loadingData, setLoadingData] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoadingData(true);

      const tournamentsData = await getTournaments();
      const teamsData = await getTeams();
      const entriesData = await getTournamentEntries();

      setTournaments(tournamentsData);
      setTeams(teamsData);
      setEntries(entriesData);
    } catch (error) {
      toast.error('Turnirlər yüklənmədi');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !game.trim()) {
      toast.error('Turnirin adı və oyun boş ola bilməz');
      return;
    }

    setCreating(true);

    try {
      await createTournament({
        title,
        game,
        prizePool,
        maxTeams,
      });

      toast.success('Turnir yaradıldı!');

      setTitle('');
      setGame('');
      setPrizePool(0);
      setMaxTeams(16);

      await loadData();
    } catch (error) {
      toast.error('Turnir yaradılmadı');
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinTournament(tournamentId: string) {
    if (!selectedTeamId) {
      toast.error('Əvvəl komanda seç');
      return;
    }

    setJoiningId(tournamentId);

    try {
      const result = await joinTournament({
        tournamentId,
        teamId: selectedTeamId,
      });

      if (result.message) {
        toast.error(result.message);
        return;
      }

      toast.success('Komanda turnirə qoşuldu!');
      await loadData();
    } catch (error) {
      toast.error('Turnirə qoşulmaq alınmadı');
      console.error(error);
    } finally {
      setJoiningId(null);
    }
  }

  function getJoinedTeams(tournamentId: string) {
    return entries.filter((entry) => entry.tournament.id === tournamentId);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            Playio.az
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Tournaments
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Turnir yarat, komanda seç və yarışlara qoşul.
          </p>
        </div>

        <form
          onSubmit={handleCreateTournament}
          className="mb-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 lg:grid-cols-2"
        >
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60 lg:col-span-2"
            placeholder="Turnirin adı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={creating}
          />

          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Oyun"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            disabled={creating}
          />

          <input
            type="number"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Mükafat fondu"
            value={prizePool}
            onChange={(e) => setPrizePool(Number(e.target.value))}
            disabled={creating}
          />

          <input
            type="number"
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Maksimum komanda sayı"
            value={maxTeams}
            onChange={(e) => setMaxTeams(Number(e.target.value))}
            disabled={creating}
          />

          <button
            disabled={creating}
            className="rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Turnir yaradılır...' : 'Turnir yarat'}
          </button>
        </form>

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8">
          <label className="mb-2 block text-sm text-zinc-400">
            Turnirə qoşulacaq komandanı seç
          </label>

          <select
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
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

        {loadingData ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Turnirlər yüklənir...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Hələ heç bir turnir yoxdur.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {tournaments.map((tournament) => {
              const joinedTeams = getJoinedTeams(tournament.id);
              const isJoining = joiningId === tournament.id;

              return (
                <div
                  key={tournament.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                  <h2 className="break-words text-2xl font-bold">
                    {tournament.title}
                  </h2>

                  <div className="mt-3 space-y-1 text-zinc-300">
                    <p className="break-words">🎮 Oyun: {tournament.game}</p>
                    <p>💰 Mükafat: {tournament.prizePool} AZN</p>
                    <p>
                      👥 Komandalar: {joinedTeams.length}/{tournament.maxTeams}
                    </p>
                    <p>📌 Status: {tournament.status}</p>
                  </div>

                  <button
                    onClick={() => handleJoinTournament(tournament.id)}
                    disabled={isJoining}
                    className="mt-4 w-full rounded-xl bg-violet-600 px-5 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isJoining ? 'Qoşulur...' : 'Seçilmiş komandanı qoş'}
                  </button>

                  <div className="mt-5">
                    <h3 className="font-bold">Qoşulan komandalar:</h3>

                    {joinedTeams.length === 0 ? (
                      <p className="mt-2 text-zinc-400">
                        Hələ komanda yoxdur
                      </p>
                    ) : (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
                        {joinedTeams.map((entry) => (
                          <li key={entry.id} className="break-words">
                            {entry.team.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}