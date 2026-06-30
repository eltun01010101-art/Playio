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

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
              Playio Games
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Domino
            </h1>

            <p className="mt-2 max-w-2xl text-zinc-400">
              Domino otağı yarat, dostunla qoşul və oyuna başla.
            </p>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={creating}
            className="rounded-xl bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Yaradılır...' : 'Otaq yarat'}
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Otaqlar yüklənir...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Hələ domino otağı yoxdur.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => {
              const isJoining = joiningId === room.id;

              return (
                <div
                  key={room.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">Domino masası</h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        ID: {room.id}
                      </p>
                    </div>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                      {getStatusLabel(room.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-800 p-4">
                      <p className="text-sm text-zinc-500">Oyunçu 1</p>
                      <p className="mt-1 font-bold">
                        {getPlayerName(room.playerOne)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-800 p-4">
                      <p className="text-sm text-zinc-500">Oyunçu 2</p>
                      <p className="mt-1 font-bold">
                        {getPlayerName(room.playerTwo)}
                      </p>
                    </div>
                  </div>

                  {room.status === 'waiting' && (
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={isJoining}
                      className="mt-5 w-full rounded-xl bg-violet-600 px-5 py-3 font-bold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isJoining ? 'Qoşulur...' : 'Otağa qoşul'}
                    </button>
                  )}

                  {room.status === 'active' && (
                    <div className="mt-5 rounded-xl border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-300">
                      Oyun aktivdir. Növbəti mərhələdə masa və domino daşlarını
                      burada göstərəcəyik.
                    </div>
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