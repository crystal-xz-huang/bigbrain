import {
  Banner,
  BannerContent,
  BannerDescription,
  BannerFooter,
  BannerHeader,
} from '@/components/dashboard/user-profile/banner';
import { CardSkeleton } from '@/components/ui/skeletons';
import { Subheading } from '@/components/ui/heading';

export function CardsSkeleton() {
  return (
    <ul
      role="list"
      className="flex flex-row flex-shrink-0 space-x-3 overflow-x-auto"
    >
      <li className="flex-shrink-0 w-54">
        <CardSkeleton />
      </li>
      <li className="flex-shrink-0 w-54">
        <CardSkeleton />
      </li>
      <li className="flex-shrink-0 w-54">
        <CardSkeleton />
      </li>
      <li className="flex-shrink-0 w-54">
        <CardSkeleton />
      </li>
    </ul>
  );
}

export function UserGamesSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row items-center justify-between text-base/7 font-semibold sm:text-sm/6">
        <Subheading>My Games</Subheading>
      </div>
      <CardsSkeleton />
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
