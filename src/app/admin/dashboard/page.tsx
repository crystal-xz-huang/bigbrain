import { CreateGame } from '@/components/dashboard/cta';
import UserGames from '@/components/dashboard/user-games';
import UserProfile from '@/components/dashboard/user-profile';
import {
  Container,
  Heading
} from '@/components/ui/page';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'Dashboard',
  },
};

export default function DashboardPage() {
  return (
    <>
      <Heading>Dashboard</Heading>
      <Container>
        <div className="flex flex-col space-y-6">
          <Suspense fallback={<div>Loading user info...</div>}>
            <UserProfile />
          </Suspense>
          <CreateGame />
          <Suspense fallback={<div>Loading user games...</div>}>
            <UserGames />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
