'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
} from '../../lib/api';

type Team = {
  id: string;
  name: string;
  game: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');
  const [game, setGame] = useState('');

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editGame, setEditGame] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTeams() {
    try {
      setLoadingTeams(true);
      const data = await getTeams();
      setTeams(Array.isArray(data) ? data : []);
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
      const result = await createTeam({ name, game });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Komanda yaradılmadı');
        return;
      }

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

  function startEdit(team: Team) {
    setEditingTeamId(team.id);
    setEditName(team.name);
    setEditGame(team.game);
  }

  function cancelEdit() {
    setEditingTeamId(null);
    setEditName('');
    setEditGame('');
  }

  async function handleUpdate(teamId: string) {
    if (!editName.trim() || !editGame.trim()) {
      toast.error('Komanda adı və oyun boş ola bilməz');
      return;
    }

    setSavingId(teamId);

    try {
      const result = await updateTeam(teamId, {
        name: editName,
        game: editGame,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Komanda yenilənmədi');
        return;
      }

      toast.success('Komanda yeniləndi!');
      cancelEdit();
      await loadTeams();
    } catch (error) {
      toast.error('Komanda yenilənmədi');
      console.error(error);
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(teamId: string) {
    const confirmed = confirm('Bu komandanı silmək istədiyinə əminsən?');

    if (!confirmed) {
      return;
    }

    setDeletingId(teamId);

    try {
      const result = await deleteTeam(teamId);

      if (result.message && !result.success) {
        toast.error(result.message);
        return;
      }

      toast.success('Komanda silindi!');
      await loadTeams();
    } catch (error) {
      toast.error('Komanda silinmədi');
      console.error(error);
    } finally {
      setDeletingId(null);
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
            {teams.map((team) => {
              const isEditing = editingTeamId === team.id;
              const isSaving = savingId === team.id;
              const isDeleting = deletingId === team.id;

              return (
                <div
                  key={team.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={isSaving}
                      />

                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500 disabled:opacity-60"
                        value={editGame}
                        onChange={(e) => setEditGame(e.target.value)}
                        disabled={isSaving}
                      />

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => handleUpdate(team.id)}
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
                        {team.name}
                      </h2>

                      <p className="mt-2 break-words text-zinc-400">
                        Oyun: {team.game}
                      </p>

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => startEdit(team)}
                          className="rounded-xl border border-zinc-700 px-4 py-3 font-bold transition hover:bg-zinc-800"
                        >
                          Düzenlə
                        </button>

                        <button
                          onClick={() => handleDelete(team.id)}
                          disabled={isDeleting}
                          className="rounded-xl bg-red-600 px-4 py-3 font-bold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? 'Silinir...' : 'Sil'}
                        </button>
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