import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-violet-500 sm:text-sm sm:tracking-[0.3em]">
          Azərbaycanın Esports Platforması
        </p>

        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Komandanı yarat, turnirlərdə iştirak et, qələbə qazan.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          Playio.az Azərbaycan oyunçuları, komandaları və turnirləri üçün
          hazırlanmış müasir esports platformasıdır.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-violet-600 px-6 py-3 text-center font-bold transition hover:bg-violet-700"
          >
            Başla
          </Link>

          <Link
            href="/tournaments"
            className="rounded-xl border border-zinc-700 px-6 py-3 text-center font-bold transition hover:bg-zinc-900"
          >
            Turnirlərə bax
          </Link>
        </div>
      </section>
    </main>
  );
}