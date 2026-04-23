'use client';

import { Feed, FeedContent, FeedHeader } from '@/components/ui/feed/container';
import {
  FeedLink,
  FeedList,
  FeedListItem,
  NumberedFeedList,
  NumberedFeedListItem,
} from '@/components/ui/feed/list';
import { CardsSkeleton } from '@/components/ui/skeletons';
import {
  CategoryGamesListDTO,
  GamesListDTO
} from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { Suspense, use } from 'react';
import { Game, GameHorizontal } from './game';
import { Heading } from '@/components/home/heading';

export function FeedLayout({
  title,
  promise,
  ordered = false,
}: {
  title: string;
  promise: Promise<GamesListDTO | CategoryGamesListDTO>;
  ordered?: boolean;
}) {
  return (
    <Feed>
      <FeedHeader>
        {/* Stream header */}
        <Suspense fallback={<Heading>{title}</Heading>}>
          <Header title={title} promise={promise} />
        </Suspense>
      </FeedHeader>

      <FeedContent>
        {/* Stream list */}
        <Suspense fallback={<CardsSkeleton />}>
          <List promise={promise} ordered={ordered} />
        </Suspense>
      </FeedContent>
    </Feed>
  );
}

export function List({
  promise,
  ordered,
}: {
  promise: Promise<GamesListDTO | CategoryGamesListDTO>;
  ordered: boolean;
}) {
  const data = use(promise);
  if (!data || data.games.length === 0) return null;

  // if ordered, group into columns of 3 games per row
  if (ordered) {
    return (
      <NumberedFeedList>
        {data.games.map((game, i) => (
          <NumberedFeedListItem key={game.id} index={i}>
            <GameHorizontal game={game} />
          </NumberedFeedListItem>
        ))}
      </NumberedFeedList>
    );
  }

  return (
    <FeedList>
      {data.games.map((game) => (
        <FeedListItem key={game.id}>
          <Game game={game} />
        </FeedListItem>
      ))}
    </FeedList>
  );
}

export function Header({
  title,
  promise,
}: {
  title: string;
  promise: Promise<GamesListDTO | CategoryGamesListDTO>;
}) {
  const data = use(promise);
  if (!data || ('total' in data && data.total === 0) || data.games.length === 0)
    return null;

  return 'total' in data ? (
    <>
      <Heading>{title}</Heading>
      <FeedLink href={routes.browse(data.category)}>
        {`See all ${data.total}`}
      </FeedLink>
    </>
  ) : (
    <Heading>{title}</Heading>
  );
}
