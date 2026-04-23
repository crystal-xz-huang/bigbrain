import { Pagination } from '@/components/games/list';
import { Container, Heading, PageContent } from '@/components/ui/page';
import { Search } from '@/components/ui/search';
import { CardsListSkeleton } from '@/components/ui/skeletons';
import { Strong } from '@/components/ui/text';
import {
  getGameCategories,
  getTotalGamesFromCategory,
  getTotalPagesFromCategory,
} from '@/lib/data/game-dto';
import { OrderOption, SortOption } from '@/lib/definitions/types';
import { slugify, unslugify } from '@/lib/utils';
import { Suspense } from 'react';
import { Filter } from './filter';
import List from './list';

export async function generateStaticParams() {
  const categories = await getGameCategories();
  return categories.map((cat) => ({ category: slugify(cat.name) }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const category = (await params).category;
  const {
    page = '1',
    sort = 'name',
    order = 'asc',
    query = '',
  } = await searchParams;

  const totalGames = await getTotalGamesFromCategory(category);
  const totalPages = await getTotalPagesFromCategory(category, query);
  const currentPage = Number(page) || 1;
  const categoryName = unslugify(category);

  return (
    <PageContent>
      <Heading>{categoryName}</Heading>
      <Container>
        {/* Heading */}
        <div className="flex items-center justify-between gap-2 mb-6 w-full">
          <Search placeholder="Search games..." className="min-w-64 flex-1" />
          <Filter className="max-w-48" />
        </div>

        {/* Content */}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <Suspense key={query + currentPage} fallback={<CardsListSkeleton />}>
            {totalGames > 0 ? (
              <List
                category={category}
                query={query}
                currentPage={currentPage}
                sort={sort as SortOption}
                order={order as OrderOption}
              />
            ) : (
              <Strong className="text-center">
                {`Sorry, we couldn't find any games in the ${categoryName} category`}
              </Strong>
            )}
          </Suspense>
          <Pagination totalPages={totalPages} />
        </div>
      </Container>
    </PageContent>
  );
}
