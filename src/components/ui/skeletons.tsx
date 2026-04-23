import {
  Card,
  CardFooter,
  CardCover,
  CardTitle,
  CardDescription,
} from '@/components/ui/feed/card';

/***************************************************************
                     GAME CARD SKELETONS
***************************************************************/

export function CardSkeleton() {
  return (
    <Card>
      <CardCover>
        <div className="skeleton w-full h-full"></div>
      </CardCover>
      <CardFooter>
        <CardTitle>
          <div>
            <div className="skeleton h-4 w-full rounded-sm"></div>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="skeleton h-4 w-32 rounded-sm"></div>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

export function CardsSkeleton() {
  return (
    <FeedList>
      <FeedListItem>
        <CardSkeleton />
      </FeedListItem>
      <FeedListItem>
        <CardSkeleton />
      </FeedListItem>
      <FeedListItem>
        <CardSkeleton />
      </FeedListItem>
      <FeedListItem>
        <CardSkeleton />
      </FeedListItem>
    </FeedList>
  );
}

export function CardsListSkeleton() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <li className="col-span-1 w-full">
        <CardSkeleton />
      </li>
      <li className="col-span-1 w-full">
        <CardSkeleton />
      </li>
      <li className="col-span-1 w-full">
        <CardSkeleton />
      </li>
      <li className="col-span-1 w-full">
        <CardSkeleton />
      </li>
    </ul>
  );
}

/***************************************************************
                     PROFILE BANNER SKELETON
***************************************************************/

import {
  Banner,
  BannerContent,
  BannerDescription,
  BannerFooter,
  BannerHeader,
} from '@/components/ui/banners/profile-banner';
import { FeedList, FeedListItem } from '@/components/ui/feed/list';

export function ProfileBannerSkeleton() {
  return (
    <Banner>
      <BannerContent className="bg-beige-200">
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
      <BannerFooter className="bg-beige-100 px-6 py-5">
        <div className="mx-6 skeleton w-40 h-[1rem]"></div>
        <div className="mx-6 skeleton w-40 h-[1rem]"></div>
      </BannerFooter>
    </Banner>
  );
}
