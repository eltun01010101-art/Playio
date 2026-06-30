'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createGame,
  deleteGame,
  getGames,
  updateGame,
  type GameStatus,
} from '../../../lib/api';

type Game = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  genre?: string;
  platform?: string;
  status: GameStatus;
};

type User = {
  role?: string;
};

export default function AdminGamesPage() {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState<GameStatus>('active');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editPlatform, setEditPlatform] = useState('');
  const [editStatus, setEditStatus] = useState<GameStatus>('active');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadGames() {
    try {
      setLoadingGames(true);

      const savedUser = localStorage.getItem('user');
      const user: User | null = savedUser ? JSON.parse(savedUser) : null;

      if (user?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      const data = await getGames();
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Oyunlar yüklənmədi');
      console.error(error);
    } finally {
      setLoadingGames(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-')
      .replaceAll('ə', 'e')
      .replaceAll('ö', 'o')
      .replaceAll('ü', 'u')
      .replaceAll('ı', 'i')
      .replaceAll('ğ', 'g')
      .replaceAll('ş', 's')
      .replaceAll('ç', 'c');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast.error('Oyun adı və slug boş ola bilməz');
      return;
    }

    setSaving(true);

    try {
      const result = await createGame({
        name,
        slug,
        genre,
        platform,
        status,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Oyun yaradılmadı');
        return;
      }

      toast.success('Oyun yaradıldı!');
      setName('');
      setSlug('');
      setGenre('');
      setPlatform('');
      setStatus('active');
      await loadGames();
    } catch (error) {
      toast.error('Oyun yaradılmadı');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(game: Game) {
    setEditingId(game.id);
    setEditName(game.name);
    setEditSlug(game.slug);
    setEditGenre(game.genre ?? '');
    setEditPlatform(game.platform ?? '');
    setEditStatus(game.status);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditSlug('');
    setEditGenre('');
    setEditPlatform('');
    setEditStatus('active');
  }

  async function handleUpdate(gameId: string) {
    if (!editName.trim() || !editSlug.trim()) {
      toast.error('Oyun adı və slug boş ola bilməz');
      return;
    }

    try {
      const result = await updateGame(gameId, {
        name: editName,
        slug: editSlug,
        genre: editGenre,
        platform: editPlatform,
        status: editStatus,
      });

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Oyun yenilənmədi');
        return;
      }

      toast.success('Oyun yeniləndi!');
      cancelEdit();
      await loadGames();
    } catch (error) {
      toast.error('Oyun yenilənmədi');
      console.error(error);
    }
  }

  async function handleDelete(gameId: string) {
    const confirmed = confirm('Bu oyunu silmək istədiyinə əminsən?');

    if (!confirmed) return;

    setDeletingId(gameId);

    try {
      const result = await deleteGame(gameId);

      if (result.message && !result.success) {
        toast.error(result.message);
        return;
      }

      toast.success('Oyun silindi!');
      await loadGames();
    } catch (error) {
      toast.error('Oyun silinmədi');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Oyunlar
          </h1>

          <p className="mt-2 text-zinc-400">
            Platformadakı oyunları əlavə et, düzənlə və idarə et.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 lg:grid-cols-2"
        >
          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Oyun adı: Valorant"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(makeSlug(e.target.value));
            }}
          />

          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Slug: valorant"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Janr: FPS, MOBA..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <input
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            placeholder="Platforma: PC, Mobile..."
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />

          <select
            className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as GameStatus)}
          >
            <option value="active">Aktiv</option>
            <option value="inactive">Deaktiv</option>
          </select>

          <button
            disabled={saving}
            className="rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:opacity-60"
          >
            {saving ? 'Yaradılır...' : 'Oyun yarat'}
          </button>
        </form>

        {loadingGames ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Oyunlar yüklənir...
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Hələ oyun yoxdur.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {games.map((game) => {
              const isEditing = editingId === game.id;
              const isDeleting = deletingId === game.id;

              return (
                <div
                  key={game.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />

                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                      />

                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                        value={editGenre}
                        onChange={(e) => setEditGenre(e.target.value)}
                      />

                      <input
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                        value={editPlatform}
                        onChange={(e) => setEditPlatform(e.target.value)}
                      />

                      <select
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-violet-500"
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as GameStatus)
                        }
                      >
                        <option value="active">Aktiv</option>
                        <option value="inactive">Deaktiv</option>
                      </select>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => handleUpdate(game.id)}
                          className="rounded-xl bg-violet-600 px-4 py-3 font-bold hover:bg-violet-700"
                        >
                          Yadda saxla
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="rounded-xl border border-zinc-700 px-4 py-3 font-bold hover:bg-zinc-800"
                        >
                          Ləğv et
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="break-words text-2xl font-black">
                            {game.name}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            /{game.slug}
                          </p>
                        </div>

                        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                          {game.status === 'active' ? 'Aktiv' : 'Deaktiv'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1 text-zinc-400">
                        <p>🎮 Janr: {game.genre || '-'}</p>
                        <p>💻 Platforma: {game.platform || '-'}</p>
                      </div>

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => startEdit(game)}
                          className="rounded-xl border border-zinc-700 px-4 py-3 font-bold hover:bg-zinc-800"
                        >
                          Düzenlə
                        </button>

                        <button
                          onClick={() => handleDelete(game.id)}
                          disabled={isDeleting}
                          className="rounded-xl bg-red-600 px-4 py-3 font-bold hover:bg-red-700 disabled:opacity-60"
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