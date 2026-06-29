import type { Metadata } from 'next';
import './globals.css';

import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Playio.az',
  description: 'Azərbaycanın Esports Platforması',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}