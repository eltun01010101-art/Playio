import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-black text-violet-500">
              Playio.az
            </h3>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Azərbaycanın esports platforması. Komandanı yarat, turnirlərə
              qoşul və qələbə qazan.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white">
              Səhifələr
            </h4>

            <div className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/">Home</Link>
              <Link href="/teams">Teams</Link>
              <Link href="/tournaments">Tournaments</Link>
              <Link href="/profile">Profile</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white">
              Status
            </h4>

            <p className="mt-3 text-sm text-zinc-400">
              Playio MVP v1 • Mobile Ready 🚀
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
          © 2026 Playio.az — Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}