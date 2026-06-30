'use client';

import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import {
  createGameRoom,
  getGameRooms,
  joinGameRoom,
} from '../../lib/api';

type User = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

type GameRoom = {
  id: string;
  gameSlug: string;
  status: 'waiting' | 'active' | 'finished';
  playerOne: User | null;
  playerTwo: User | null;
  currentTurnUserId: string | null;
  winnerUserId: string | null;
};

export default function DominoPage() {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  async function loadRooms() {
    try {
      setLoading(true);
      const data = await getGameRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Otaqlar yüklənmədi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function handleCreateRoom() {
    setCreating(true);

    try {
      const result = await createGameRoom();

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Otaq yaradılmadı');
        return;
      }

      toast.success('Domino otağı yaradıldı!');
      await loadRooms();
    } catch (error) {
      toast.error('Otaq yaradılmadı');
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinRoom(roomId: string) {
    setJoiningId(roomId);

    try {
      const result = await joinGameRoom(roomId);

      if (result.message || result.statusCode) {
        toast.error(result.message || 'Otağa qoşulmaq alınmadı');
        return;
      }

      toast.success('Otağa qoşuldun!');
      await loadRooms();
    } catch (error) {
      toast.error('Otağa qoşulmaq alınmadı');
      console.error(error);
    } finally {
      setJoiningId(null);
    }
  }

  function getPlayerName(user: User | null) {
    if (!user) return 'Boş yer';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return user.username;
  }

  function getStatusLabel(status: GameRoom['status']) {
    if (status === 'waiting') return 'Oyunçu gözləyir';
    if (status === 'active') return 'Oyun başladı';
    return 'Bitib';
  }

  function getStatusClass(status: GameRoom['status']) {
    if (status === 'waiting') {
      return 'bg-violet-600 text-white';
    }

    if (status === 'active') {
      return 'bg-emerald-500 text-white';
    }

    return 'bg-zinc-700 text-zinc-200';
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-zinc-900 bg-black px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(124,58,237,0.4),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="py-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-400">
              Playio Games
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Domino
              <br />
              <span className="text-violet-500">masasına qoşul.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Otaq yarat, rəqibini gözlə və Playio daxilində real vaxtda domino
              oyununa başla.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="rounded-2xl bg-violet-600 px-8 py-4 font-bold shadow-lg shadow-violet-900/40 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Otaq yaradılır...' : '🎲 Otaq yarat'}
              </button>

              <a
                href="#rooms"
                className="rounded-2xl border border-zinc-700 px-8 py-4 text-center font-bold transition hover:bg-zinc-900"
              >
                Aktiv otaqlara bax
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">2</p>
                <p className="mt-1 text-sm text-zinc-400">Oyunçu</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">28</p>
                <p className="mt-1 text-sm text-zinc-400">Daş</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">Live</p>
                <p className="mt-1 text-sm text-zinc-400">Oyun</p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center">
            <img
              src="/images/domino-hero.png"
              alt="Domino"
              className="relative z-10 max-h-[440px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="rooms" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
                Domino Rooms
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Aktiv masalar
              </h2>

              <p className="mt-2 text-zinc-400">
                Otaq seç, qoşul və oyuna başla.
              </p>
            </div>

            <button
              onClick={loadRooms}
              className="rounded-xl border border-zinc-700 px-5 py-3 font-bold transition hover:bg-zinc-900"
            >
              Yenilə
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
              Otaqlar yüklənir...
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
              <h3 className="text-2xl font-black">
                Hələ domino otağı yoxdur.
              </h3>

              <p className="mt-3 text-zinc-400">
                İlk masanı sən yarat və digər oyunçuları oyuna dəvət et.
              </p>

              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:opacity-60"
              >
                {creating ? 'Yaradılır...' : 'İlk otağı yarat'}
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {rooms.map((room) => {
                const isJoining = joiningId === room.id;

                return (
                  <div
                    key={room.id}
                    className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition hover:border-violet-700"
                  >
                    <div className="relative h-40 overflow-hidden bg-zinc-950">
                      <img
                        src="/images/domino-card.png"
                        alt="Domino table"
                        className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                          room.status,
                        )}`}
                      >
                        {getStatusLabel(room.status)}
                      </span>
                    </div>

                    <div className="p-5">
                      <div>
                        <h3 className="text-2xl font-black">
                          Domino masası
                        </h3>

                        <p className="mt-1 break-all text-xs text-zinc-500">
                          ID: {room.id}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-zinc-800 p-4">
                          <p className="text-sm text-zinc-500">Oyunçu 1</p>
                          <p className="mt-1 break-words font-bold">
                            {getPlayerName(room.playerOne)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-800 p-4">
                          <p className="text-sm text-zinc-500">Oyunçu 2</p>
                          <p className="mt-1 break-words font-bold">
                            {getPlayerName(room.playerTwo)}
                          </p>
                        </div>
                      </div>

                      {room.status === 'waiting' && (
                        <button
                          onClick={() => handleJoinRoom(room.id)}
                          disabled={isJoining}
                          className="mt-5 w-full rounded-2xl bg-violet-600 px-5 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isJoining ? 'Qoşulur...' : 'Otağa qoşul'}
                        </button>
                      )}

                      {room.status === 'active' && (
                        <div className="mt-5 rounded-2xl border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-300">
                          Oyun aktivdir. Növbəti mərhələdə masa və domino
                          daşlarını burada göstərəcəyik.
                        </div>
                      )}

                      {room.status === 'finished' && (
                        <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-sm text-zinc-300">
                          Bu oyun artıq bitib.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}