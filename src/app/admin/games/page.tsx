import CreateGameButton from '@/components/games/buttons/create-game';
import List from '@/components/games/list';
import Pagination from '@/components/games/pagination';
import { Container, Heading } from '@/components/ui/page';
import { Search } from '@/components/ui/search';
import { fetchGamesPages } from '@/lib/data';
import { requireUser } from '@/lib/session';
import { Metadata } from 'next';
import { Suspense } from 'react';

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
          <Search placeholder="Search games..." />
          <CreateGameButton />
        </div>
        {/* Section Content */}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <Suspense
            key={query + currentPage}
            fallback={<div>Loading games...</div>}
          >
            <List query={query} currentPage={currentPage} />
          </Suspense>

          <Pagination totalPages={totalPages} />
        </div>
      </Container>
    </>
  );
}
