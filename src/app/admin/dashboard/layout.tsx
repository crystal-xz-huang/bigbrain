import type { Metadata } from 'next';
import { Heading } from '@/components/ui/heading';

import CreateGameButton from '@/components/admin/dashboard/create-game-button';
import NavLinks from '@/components/admin/dashboard/nav-links';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'Dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative border-b border-zinc-950/10 pb-5 dark:border-white/10 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <Heading>Dashboard</Heading>
          <CreateGameButton className="mt-1.5 sm:mt-3 md:mt-0" />
        </div>
        <NavLinks className="mt-1.5" />
      </div>
      <div className="container mx-auto mt-6">{children}</div>
    </>
  );
}
