import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-2xl font-bold text-violet-500">
          Playio.az
        </Link>

        <div className="flex gap-6 text-sm text-zinc-300">
          <Link href="/">Əsas Səhfə</Link>
          <Link href="/teams">Komandalar</Link>
          <Link href="/tournaments">Turnirlər</Link>
          <Link href="/dashboard">İdarə paneli</Link>
          <Link href="/login">Giriş</Link>
          <Link href="/register">Qeydiyyat</Link>
        </div>
      </div>
    </nav>
  );
}