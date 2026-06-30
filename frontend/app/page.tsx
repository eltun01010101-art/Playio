import Link from 'next/link';

const featuredGames = [
  {
    title: 'Domino',
    image: '/images/domino-card.png',
    href: '/domino',
    status: 'AKTİV',
  },
  {
    title: 'Şahmat',
    image: '/images/chess-card.png',
    href: '#',
    status: 'TEZLİKLƏ',
  },
  {
    title: 'Nərd',
    image: '/images/nard-card.png',
    href: '#',
    status: 'TEZLİKLƏ',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-zinc-900 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.35),transparent_30%)]" />

        <div className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-violet-500">
              Azərbaycanın Esports Platforması
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Oyna.
              <br />
              Yarış.
              <br />
              <span className="text-violet-500">Qazan.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
              Playio.az Azərbaycan oyunçuları, komandaları və turnirləri üçün
              hazırlanmış müasir esports və online oyun platformasıdır.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-violet-600 px-8 py-4 text-center font-bold transition hover:bg-violet-700"
              >
                İndi Başla
              </Link>

              <Link
                href="/games"
                className="rounded-2xl border border-zinc-700 px-8 py-4 text-center font-bold transition hover:bg-zinc-900"
              >
                Oyunları Kəşf Et
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">4+</p>
                <p className="mt-1 text-sm text-zinc-400">Oyun</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">100+</p>
                <p className="mt-1 text-sm text-zinc-400">Komanda</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">24/7</p>
                <p className="mt-1 text-sm text-zinc-400">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/images/domino-hero.png"
              alt="Playio Games"
              className="max-h-[500px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
                Playio Games
              </p>

              <h2 className="mt-3 text-4xl font-black">
                Populyar Oyunlar
              </h2>
            </div>

            <Link
              href="/games"
              className="hidden font-bold text-violet-400 hover:text-violet-300 sm:block"
            >
              Hamısına bax →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredGames.map((game) => (
              <Link
                key={game.title}
                href={game.href}
                className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-violet-600"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-3 py-1 text-xs font-black">
                    {game.status}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-3xl font-black">
                    {game.title}
                  </h3>

                  <p className="mt-4 text-zinc-400">
                    Playio daxilində real vaxtda dostlarınla oyna.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-900 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h3 className="text-3xl font-black">
              Komandanı yarat
            </h3>

            <p className="mt-4 text-zinc-400">
              Dostlarınla komanda qur və böyük turnirlərdə iştirak et.
            </p>

            <Link
              href="/teams"
              className="mt-8 inline-block rounded-2xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-700"
            >
              Teams →
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h3 className="text-3xl font-black">
              Turnirlərə qoşul
            </h3>

            <p className="mt-4 text-zinc-400">
              Azərbaycanın esports turnirlərində mübarizə apar.
            </p>

            <Link
              href="/tournaments"
              className="mt-8 inline-block rounded-2xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-700"
            >
              Tournaments →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}