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
    setIsLoggedIn(!!token);
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black text-violet-500 sm:text-2xl">
          Playio.az
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm md:hidden"
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
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
              >
                Çıxış
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>

              <Link href="/register" className="hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="rounded-lg bg-red-600 px-3 py-2 text-left font-bold text-white hover:bg-red-700"
                >
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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