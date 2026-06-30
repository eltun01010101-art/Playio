'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import {
  createTournament,
  deleteTournament,
  finishMatch,
  generateBracket,
  getMatchesByTournament,
  getTeams,
  getTournamentEntries,
  getTournaments,
  joinTournament,
  updateTournament,
  type TournamentStatus,
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
  status: TournamentStatus;
};

type TournamentEntry = {
  id: string;
  tournament: Tournament;
  team: Team;
};

type Match = {
  id: string;
  round: number;
  matchNumber: number;
  scoreA: number | null;
  scoreB: number | null;
  status: string;
  teamA: Team | null;
  teamB: Team | null;
  winner: Team | null;
};

type User = {
  role?: string;
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [entries, setEntries] = useState<TournamentEntry[]>([]);
  const [matches, setMatches] = useState<Record<string, Match[]>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState('');
  const [game, setGame] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [maxTeams, setMaxTeams] = useState(16);
  const [status, setStatus] = useState<TournamentStatus>('upcoming');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGame, setEditGame] = useState('');
  const [editPrizePool, setEditPrizePool] = useState(0);
  const [editMaxTeams, setEditMaxTeams] = useState(16);
  const [editStatus, setEditStatus] =
    useState<TournamentStatus>('upcoming');

  const [loadingData, setLoadingData] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [finishingId, setFinishingId] = useState<string | null>(null);

  const [scoreAByMatch, setScoreAByMatch] = useState<Record<string, number>>({});
  const [scoreBByMatch, setScoreBByMatch] = useState<Record<string, number>>({});

  async function loadData() {
    try {
      setLoadingData(true);

      const savedUser = localStorage.getItem('user');
      const user: User | null = savedUser ? JSON.parse(savedUser) : null;
      setIsAdmin(user?.role === 'admin');

      const tournamentsData = await getTournaments();
      const teamsData = await getTeams();
      const entriesData = await getTournamentEntries();

      const safeTournaments = Array.isArray(tournamentsData)
        ? tournamentsData
        : [];

      setTournaments(safeTournaments);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setEntries(Array.isArray(entriesData) ? entriesData : []);

      const matchesMap: Record<string, Match[]> = {};

      for (const tournament of safeTournaments) {
        const tournamentMatches = await getMatchesByTournament(tournament.id);

        matchesMap[tournament.id] = Array.isArray(tournamentMatches)
          ? tournamentMatches
          : [];
      }

      setMatches(matchesMap);
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

    if (!isAdmin) {
      toast.error('Turnir yaratmaq üçün admin olmalısan');
      return;
    }

    if (!title.trim() || !game.trim()) {
      toast.error('Turnirin adı və oyun boş ola bilməz');
      return;
    }

    setCreating(true);

    try {
      const result = await createTournament({
        title,
        game,
        prizePool,
        maxTeams,
        status,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Turnir yaradılmadı');
        return;
      }

      toast.success('Turnir yaradıldı!');
      setTitle('');
      setGame('');
      setPrizePool(0);
      setMaxTeams(16);
      setStatus('upcoming');

      await loadData();
    } catch (error) {
      toast.error('Turnir yaradılmadı');
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(tournament: Tournament) {
    setEditingId(tournament.id);
    setEditTitle(tournament.title);
    setEditGame(tournament.game);
    setEditPrizePool(tournament.prizePool);
    setEditMaxTeams(tournament.maxTeams);
    setEditStatus(tournament.status);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditGame('');
    setEditPrizePool(0);
    setEditMaxTeams(16);
    setEditStatus('upcoming');
  }

  async function handleUpdateTournament(tournamentId: string) {
    if (!editTitle.trim() || !editGame.trim()) {
      toast.error('Turnirin adı və oyun boş ola bilməz');
      return;
    }

    setSavingId(tournamentId);

    try {
      const result = await updateTournament(tournamentId, {
        title: editTitle,
        game: editGame,
        prizePool: editPrizePool,
        maxTeams: editMaxTeams,
        status: editStatus,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Turnir yenilənmədi');
        return;
      }

      toast.success('Turnir yeniləndi!');
      cancelEdit();
      await loadData();
    } catch (error) {
      toast.error('Turnir yenilənmədi');
      console.error(error);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeleteTournament(tournamentId: string) {
    const confirmed = confirm('Bu turniri silmək istədiyinə əminsən?');

    if (!confirmed) return;

    setDeletingId(tournamentId);

    try {
      const result = await deleteTournament(tournamentId);

      if (result.message && !result.success) {
        toast.error(result.message);
        return;
      }

      toast.success('Turnir silindi!');
      await loadData();
    } catch (error) {
      toast.error('Turnir silinmədi');
      console.error(error);
    } finally {
      setDeletingId(null);
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

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Turnirə qoşulmaq alınmadı');
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

  async function handleGenerateBracket(tournamentId: string) {
    setGeneratingId(tournamentId);

    try {
      const result = await generateBracket(tournamentId);

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Bracket yaradılmadı');
        return;
      }

      toast.success('Bracket yaradıldı!');
      await loadData();
    } catch (error) {
      toast.error('Bracket yaradılmadı');
      console.error(error);
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleFinishMatch(matchId: string) {
    const scoreA = scoreAByMatch[matchId] ?? 0;
    const scoreB = scoreBByMatch[matchId] ?? 0;

    setFinishingId(matchId);

    try {
      const result = await finishMatch({
        matchId,
        scoreA,
        scoreB,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Nəticə yadda saxlanılmadı');
        return;
      }

      toast.success('Match nəticəsi yadda saxlanıldı!');
      await loadData();
    } catch (error) {
      toast.error('Nəticə yadda saxlanılmadı');
      console.error(error);
    } finally {
      setFinishingId(null);
    }
  }

  function getJoinedTeams(tournamentId: string) {
    return entries.filter((entry) => entry.tournament.id === tournamentId);
  }

  function getStatusLabel(statusValue: TournamentStatus) {
    if (statusValue === 'upcoming') return 'Qeydiyyata aktivdir';
    if (statusValue === 'active') return 'Davam edir';
    return 'Bitib';
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
            Turnirlərə bax, komandanı seç və yarışlara qoşul.
          </p>
        </div>

        {isAdmin && (
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

            <select
              className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TournamentStatus)
              }
              disabled={creating}
            >
              <option value="upcoming">Qeydiyyata aktivdir</option>
              <option value="active">Davam edir</option>
              <option value="finished">Bitib</option>
            </select>

            <button
              disabled={creating}
              className="rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Turnir yaradılır...' : 'Turnir yarat'}
            </button>
          </form>
        )}

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
              const tournamentMatches = matches[tournament.id] ?? [];
              const isJoining = joiningId === tournament.id;
              const isEditing = editingId === tournament.id;
              const isSaving = savingId === tournament.id;
              const isDeleting = deletingId === tournament.id;
              const isGenerating = generatingId === tournament.id;

              return (
                <div
                  key={tournament.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        disabled={isSaving}
                      />

                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editGame}
                        onChange={(e) => setEditGame(e.target.value)}
                        disabled={isSaving}
                      />

                      <input
                        type="number"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editPrizePool}
                        onChange={(e) =>
                          setEditPrizePool(Number(e.target.value))
                        }
                        disabled={isSaving}
                      />

                      <input
                        type="number"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editMaxTeams}
                        onChange={(e) =>
                          setEditMaxTeams(Number(e.target.value))
                        }
                        disabled={isSaving}
                      />

                      <select
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as TournamentStatus)
                        }
                        disabled={isSaving}
                      >
                        <option value="upcoming">Qeydiyyata aktivdir</option>
                        <option value="active">Davam edir</option>
                        <option value="finished">Bitib</option>
                      </select>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() =>
                            handleUpdateTournament(tournament.id)
                          }
                          disabled={isSaving}
                          className="rounded-xl bg-violet-600 px-4 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSaving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                        </button>

                        <button
                          onClick={cancelEdit}
                          disabled={isSaving}
                          className="rounded-xl border border-zinc-700 px-4 py-3 font-bold transition hover:bg-zinc-800 disabled:opacity-60"
                        >
                          Ləğv et
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="break-words text-2xl font-bold">
                        {tournament.title}
                      </h2>

                      <div className="mt-3 space-y-1 text-zinc-300">
                        <p className="break-words">
                          🎮 Oyun: {tournament.game}
                        </p>
                        <p>💰 Mükafat: {tournament.prizePool} AZN</p>
                        <p>
                          👥 Komandalar: {joinedTeams.length}/
                          {tournament.maxTeams}
                        </p>
                        <p>
                          📌 Status: {getStatusLabel(tournament.status)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <button
                          onClick={() => handleJoinTournament(tournament.id)}
                          disabled={isJoining}
                          className="rounded-xl bg-violet-600 px-5 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isJoining
                            ? 'Qoşulur...'
                            : 'Seçilmiş komandanı qoş'}
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => startEdit(tournament)}
                              className="rounded-xl border border-zinc-700 px-5 py-3 font-bold transition hover:bg-zinc-800"
                            >
                              Düzenlə
                            </button>

                            <button
                              onClick={() =>
                                handleGenerateBracket(tournament.id)
                              }
                              disabled={isGenerating}
                              className="rounded-xl border border-violet-700 px-5 py-3 font-bold text-violet-300 transition hover:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isGenerating
                                ? 'Bracket yaradılır...'
                                : 'Bracket yarat'}
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteTournament(tournament.id)
                              }
                              disabled={isDeleting}
                              className="rounded-xl bg-red-600 px-5 py-3 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeleting ? 'Silinir...' : 'Sil'}
                            </button>
                          </>
                        )}
                      </div>

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

                      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                        <h3 className="font-bold">Bracket / Matches</h3>

                        {tournamentMatches.length === 0 ? (
                          <p className="mt-2 text-sm text-zinc-500">
                            Hələ bracket yaradılmayıb.
                          </p>
                        ) : (
                          <div className="mt-4 space-y-3">
                            {tournamentMatches.map((match) => {
                              const isFinishing = finishingId === match.id;

                              return (
                                <div
                                  key={match.id}
                                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                                >
                                  <p className="text-sm text-zinc-500">
                                    Round {match.round} • Match{' '}
                                    {match.matchNumber}
                                  </p>

                                  <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="break-words">
                                        {match.teamA?.name ?? 'TBD'}
                                      </span>
                                      <span className="font-bold">
                                        {match.scoreA ?? '-'}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                      <span className="break-words">
                                        {match.teamB?.name ?? 'TBD'}
                                      </span>
                                      <span className="font-bold">
                                        {match.scoreB ?? '-'}
                                      </span>
                                    </div>
                                  </div>

                                  {match.winner && (
                                    <p className="mt-3 text-sm font-bold text-emerald-400">
                                      Qalib: {match.winner.name}
                                    </p>
                                  )}

                                  {isAdmin && match.status !== 'finished' && (
                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                      <input
                                        type="number"
                                        className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                                        placeholder="Team A xal"
                                        value={scoreAByMatch[match.id] ?? 0}
                                        onChange={(e) =>
                                          setScoreAByMatch((prev) => ({
                                            ...prev,
                                            [match.id]: Number(e.target.value),
                                          }))
                                        }
                                      />

                                      <input
                                        type="number"
                                        className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                                        placeholder="Team B xal"
                                        value={scoreBByMatch[match.id] ?? 0}
                                        onChange={(e) =>
                                          setScoreBByMatch((prev) => ({
                                            ...prev,
                                            [match.id]: Number(e.target.value),
                                          }))
                                        }
                                      />

                                      <button
                                        onClick={() =>
                                          handleFinishMatch(match.id)
                                        }
                                        disabled={isFinishing}
                                        className="rounded-xl bg-emerald-600 px-4 py-3 font-bold transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {isFinishing
                                          ? 'Yadda saxlanılır...'
                                          : 'Nəticəni yaz'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}