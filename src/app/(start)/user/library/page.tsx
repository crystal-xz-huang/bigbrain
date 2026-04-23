import CreateGameButton from '@/components/games/buttons/create-game';
import EmptyState from '@/components/games/empty-state';
import { Pagination } from '@/components/games/list';
import { Container, Heading, PageContent } from '@/components/ui/page';
import { Search } from '@/components/ui/search';
import { CardsListSkeleton } from '@/components/ui/skeletons';
import {
  getGamesPagesFromUser,
  getTotalGamesFromUser,
} from '@/lib/data/game-dto';
import { routes } from '@/lib/routes';
import { Metadata } from 'next';
import { Suspense } from 'react';
import List from './list';
import { Filter, LayoutFilter } from './filter';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Manage all your games',
};

export default async function GamesPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalGames = await getTotalGamesFromUser();
  const totalPages = await getGamesPagesFromUser(query);

  return (
    <PageContent>
      <Heading>Games</Heading>
      <Container>
        {/* Heading */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <Search placeholder="Search games..." className="min-w-64 flex-1" />
          <CreateGameButton redirectTo={routes.user.library} />
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-end gap-4 min-w-0">
          <LayoutFilter />
        </div>

        {/* Content */}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <Suspense key={query + currentPage} fallback={<CardsListSkeleton />}>
            {totalGames > 0 ? (
              <List query={query} currentPage={currentPage} />
            ) : (
              <EmptyState />
            )}
          </Suspense>
          <Pagination totalPages={totalPages} />
        </div>
      </Container>
    </PageContent>
  );
}
