import { ProfileBannerSkeleton } from '@/components/ui/skeletons';
import { getProfileBannerDTO } from '@/lib/data/user-dto';
import { Suspense } from 'react';

import ProfileBanner from './banner';

export default function WelcomeBanner() {
  // Don't await the data fetching function
  const profile = getProfileBannerDTO();

  // Pass the promise to the ProfileBanner component
  return (
    <Suspense fallback={<ProfileBannerSkeleton />}>
      <ProfileBanner promise={profile} />
    </Suspense>
  );
}
