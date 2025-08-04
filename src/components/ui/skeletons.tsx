import { Card, CardContent, CardHeader } from '@/components/games/cards';

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="skeleton w-full h-full"></div>
      </CardHeader>
      <CardContent>
        <div className="skeleton h-4 w-full mt-1 rounded-sm"></div>
        <div className="skeleton h-4 w-28 mt-2 rounded-sm"></div>
      </CardContent>
    </Card>
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
