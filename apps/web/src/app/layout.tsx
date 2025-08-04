import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './global.css';

import { Toaster } from '@nx-ddd/ui';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stack Template',
  description: 'A Multi-tenant Next.js Starter Template',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
