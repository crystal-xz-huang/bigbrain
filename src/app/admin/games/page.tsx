import { Container, Heading } from '@/components/ui/page';
import { Search } from '@/components/ui/search';
import { CardsListSkeleton } from '@/components/ui/skeletons';
import { fetchGamesPages } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { Metadata } from 'next';
import { Suspense } from 'react';

import CreateGameButton from '@/components/games/buttons/create-game';
import List from '@/components/games/list';
import Pagination from '@/components/games/pagination';

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

  const user = await requireUser();
  const totalPages = await fetchGamesPages(query, user);

  return (
    <>
      <Heading>Games</Heading>
      <Container>
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <Search placeholder="Search games..." className='min-w-64 flex-1' />
          <CreateGameButton />
        </div>
        {/* Section Content */}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <Suspense key={query + currentPage} fallback={<CardsListSkeleton />}>
            <List query={query} currentPage={currentPage} />
          </Suspense>
          <Pagination totalPages={totalPages} />
        </div>
      </Container>
    </>
  );
}
