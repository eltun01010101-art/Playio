'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function checkAuth() {
    const token = localStorage.getItem('token');
    setIsLoggedIn(Boolean(token));
  }

  useEffect(() => {
    checkAuth();

    window.addEventListener('authChanged', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChanged', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setOpen(false);

    window.dispatchEvent(new Event('authChanged'));
    router.push('/login');
  }

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/teams', label: 'Teams' },
    { href: '/tournaments', label: 'Tournaments' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-xl font-black text-violet-500 sm:text-2xl"
        >
          Playio.az
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-h-11 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold md:hidden"
        >
          {open ? 'Bağla' : 'Menyu'}
        </button>

        <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
              >
                Çıxış
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-violet-600 px-4 py-2 font-bold text-white hover:bg-violet-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 md:hidden">
          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="min-h-11 rounded-xl bg-red-600 px-4 py-3 text-left font-bold text-white hover:bg-red-700"
                >
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="min-h-11 rounded-xl bg-violet-600 px-4 py-3 font-bold text-white hover:bg-violet-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}