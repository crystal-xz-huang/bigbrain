import {
  BannerGroup,
  CreateGameBanner,
  JoinGameBanner,
} from '@/components/dashboard/banners';
import {
  ProfileBannerSkeleton,
  UserGamesSkeleton,
} from '@/components/dashboard/skeletons';
import { Container, Heading } from '@/components/ui/page';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import UserGames from '@/components/dashboard/user-games';
import UserProfile from '@/components/dashboard/user-profile';

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
          <Suspense fallback={<ProfileBannerSkeleton />}>
            <UserProfile />
          </Suspense>

          <BannerGroup>
            <CreateGameBanner />
            <JoinGameBanner />
          </BannerGroup>

          <Suspense fallback={<UserGamesSkeleton />}>
            <UserGames />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
