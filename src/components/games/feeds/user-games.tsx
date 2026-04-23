'use client';

import EmptyState from '@/components/games/empty-state';
import { Heading } from '@/components/home/heading';
import { Game } from '@/components/games/feeds/game';
import { Feed, FeedContent, FeedHeader } from '@/components/ui/feed/container';
import { FeedLink, FeedList, FeedListItem } from '@/components/ui/feed/list';
import { CardsSkeleton } from '@/components/ui/skeletons';
import { Strong } from '@/components/ui/text';
import { AdminOwnerGamesListDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { Suspense, use } from 'react';

export default function UserFeed({
  promise,
}: {
  promise: Promise<AdminOwnerGamesListDTO | null>;
}) {
  return (
    <Feed>
      <FeedHeader>
        {/* Stream header */}
        <Suspense fallback={null}>
          <Header promise={promise} />
        </Suspense>
      </FeedHeader>

      <FeedContent>
        {/* Stream list */}
        <Suspense fallback={<CardsSkeleton />}>
          <List promise={promise} />
        </Suspense>
      </FeedContent>
    </Feed>
  );
}

function List({
  promise,
}: {
  promise: Promise<AdminOwnerGamesListDTO | null>;
}) {
  const data = use(promise);
  // No user
  if (!data) return null;

  return data.total === 0 ? (
    <EmptyState>
      <Strong className="text-sm">Create your first game</Strong>
    </EmptyState>
  ) : (
    <FeedList>
      {data.games.map((game) => (
        <FeedListItem key={game.id}>
          <Game game={game} />
        </FeedListItem>
      ))}
    </FeedList>
  );
}

function Header({
  promise,
}: {
  promise: Promise<AdminOwnerGamesListDTO | null>;
}) {
  const data = use(promise);
  // No user
  if (!data) return null;

  return (
    <>
      <Heading>My Games</Heading>
      <FeedLink href={routes.user.library}>
        {data.total === 0 ? 'Go to Library' : `See all ${data.total}`}
      </FeedLink>
    </>
  );
}
