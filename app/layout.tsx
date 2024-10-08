import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import React from 'react';
import Nav from '@/components/ui/navigation/nav';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theam-provider';
import Toaster from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'px-6 md:px-12 max-w-7xl mx-auto')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Nav />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
