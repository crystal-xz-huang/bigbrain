import { Card, CardFooter, CardCover } from '@/components/ui/game-card';

export function CardSkeleton() {
  return (
    <Card>
      <CardCover>
        <div className="skeleton w-full h-full"></div>
      </CardCover>
      <CardFooter>
        <div className="skeleton h-4 w-full mt-1 rounded-sm"></div>
        <div className="skeleton h-4 w-28 mt-2 rounded-sm"></div>
      </CardFooter>
    </Card>
  );
}

export function CardsSkeleton() {
  return (
    <ul
      role="list"
      className="flex flex-row flex-shrink-0 pt-2 overflow-x-auto space-x-4"
    >
      <li className="relative flex flex-col flex-shrink-0 w-[200px] md:w-[250px]">
        <CardSkeleton />
      </li>
      <li className="relative flex flex-col flex-shrink-0 w-[200px] md:w-[250px]">
        <CardSkeleton />
      </li>
      <li className="relative flex flex-col flex-shrink-0 w-[200px] md:w-[250px]">
        <CardSkeleton />
      </li>
      <li className="relative flex flex-col flex-shrink-0 w-[200px] md:w-[250px]">
        <CardSkeleton />
      </li>
    </ul>
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
