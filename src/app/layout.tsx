import { ToastProvider } from '@/hooks/toast';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Bungee, Inter, Nunito } from 'next/font/google';
import { Tooltip } from "radix-ui";
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const bungee = Bungee({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bungee',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BigBrain',
    default: 'BigBrain',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <body
        className={`${inter.variable} ${nunito.variable} ${bungee.variable} antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
              {children}
            </Tooltip.Provider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
