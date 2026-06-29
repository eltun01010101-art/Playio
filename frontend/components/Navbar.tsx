'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/teams', label: 'Teams' },
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
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
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-800 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}