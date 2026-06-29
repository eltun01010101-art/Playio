import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

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

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              maxWidth: '92vw',
              background: '#18181b',
              color: '#fff',
              border: '1px solid #27272a',
              borderRadius: '14px',
              fontSize: '14px',
            },
            success: {
              duration: 2500,
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}