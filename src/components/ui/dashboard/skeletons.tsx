import {
  Banner,
  BannerContent,
  BannerDescription,
  BannerFooter,
  BannerHeader,
} from '@/components/ui/dashboard/user-profile/banner';
import { CardsSkeleton } from '@/components/ui/skeletons';
import { Subheading } from '@/components/ui/heading';

export function UserGamesSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between text-base/7 font-semibold sm:text-sm/6">
        <Subheading>My Games</Subheading>
      </div>
      <div className="mt-3">
        <CardsSkeleton />
      </div>
    </div>
  );
}

export function ProfileBannerSkeleton() {
  return (
    <Banner>
      <BannerContent className="bg-base-200">
        <BannerHeader>
          {/* Image */}
          <div className="skeleton size-20 shrink-0 rounded-full"></div>
          {/* Description */}
          <BannerDescription className="mt-4 sm:mt-0 sm:pt-1 flex flex-col gap-3">
            <div className="skeleton h-4 w-30"></div>
            <div className="skeleton h-4 w-38"></div>
            <div className="skeleton h-4 w-30"></div>
          </BannerDescription>
        </BannerHeader>
      </BannerContent>
      <BannerFooter className="bg-base-100 px-6 py-5">
        <div className="mx-6 skeleton w-40 h-[1rem]"></div>
        <div className="mx-6 skeleton w-40 h-[1rem]"></div>
      </BannerFooter>
    </Banner>
  );
}
