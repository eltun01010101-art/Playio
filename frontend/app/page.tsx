import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-8">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-violet-500">
          Azərbaycanın Esports Platforması
        </p>

        <h1 className="max-w-4xl text-6xl font-black leading-tight">
          Komandanı yarat, turnirlərdə iştirak et, qələbə qazan.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Playio.az Azərbaycan oyunçuları, komandaları və turnirləri üçün
          hazırlanmış müasir esports platformasıdır.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-violet-600 px-6 py-3 font-bold transition hover:bg-violet-700"
          >
            Başla
          </Link>

          <Link
            href="/tournaments"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-bold transition hover:bg-zinc-900"
          >
            Turnirlərə bax
          </Link>
        </div>
      </section>
    </main>
  );
}