import Link from 'next/link';

const games = [
  {
    title: 'Domino',
    slug: 'domino',
    description: 'Klassik domino oyunu. 2 oyunçu ilə real vaxtda oyna.',
    href: '/domino',
    status: 'Aktiv',
    image: '/images/domino-card.png',
  },
  {
    title: 'Şahmat',
    slug: 'chess',
    description: 'Strategiyanı qur, rəqibini mat et.',
    href: '#',
    status: 'Tezliklə',
    image: '/images/chess-card.png',
  },
  {
    title: 'Nərd',
    slug: 'nards',
    description: 'Nərd ustası ol, rəqibini meydanda qoy.',
    href: '#',
    status: 'Tezliklə',
    image: '/images/nard-card.png',
  },
  {
    title: 'Poker',
    slug: 'poker',
    description: 'Poker bacarıqlarını göstər, böyük qazan.',
    href: '#',
    status: 'Tezliklə',
    image: '/images/poker-card.png',
  },
];

export default function GamesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-zinc-900 bg-black px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(124,58,237,0.35),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="py-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-400">
              Playio Games
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Real oyunlar.
              <br />
              <span className="text-violet-500">Real rəqabət.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Platforma daxilində dostlarınla və digər oyunçularla real vaxtda
              oyna, xal qazan, reytinqdə yüksəl.
            </p>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <a
                href="#games"
                className="inline-flex justify-center rounded-2xl bg-violet-600 px-7 py-4 font-bold shadow-lg shadow-violet-900/40 transition hover:bg-violet-700"
              >
                🎮 Oyunları kəşf et
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">4+</p>
                <p className="mt-1 text-sm text-zinc-400">Oyun</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">1K+</p>
                <p className="mt-1 text-sm text-zinc-400">Oyunçu</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-3xl font-black text-violet-400">24/7</p>
                <p className="mt-1 text-sm text-zinc-400">Online</p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center">
            <img
              src="/images/domino-hero.png"
              alt="Domino"
              className="relative z-10 max-h-[420px] w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="games" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black sm:text-4xl">Oyunlar</h2>
              <p className="mt-2 text-zinc-400">
                Oynamaq istədiyin oyunu seç və meydana oxu!
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => {
              const isActive = game.status === 'Aktiv';

              return (
                <Link
                  key={game.slug}
                  href={game.href}
                  className={`group overflow-hidden rounded-3xl border bg-zinc-900 transition duration-300 ${
                    isActive
                      ? 'border-violet-700 hover:-translate-y-1 hover:border-violet-500'
                      : 'pointer-events-none border-zinc-800 opacity-60'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden bg-zinc-950">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-violet-600 text-white'
                      }`}
                    >
                      {game.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-black">{game.title}</h3>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
                      {game.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
                      <span className="font-bold text-zinc-300">
                        {isActive ? 'Oynamaq üçün keç' : 'Tezliklə'}
                      </span>

                      <span className="text-2xl text-violet-400 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}