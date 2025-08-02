'use client';

import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { generatePagination } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GamesPagination({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination>
      {currentPage > 1 ? (
        <PaginationPrevious href={createPageURL(currentPage - 1)} />
      ) : (
        <PaginationPrevious />
      )}

      <PaginationList>
        {allPages.map((page, idx) =>
          page === '...' ? (
            <PaginationGap key={`gap-${idx}`} />
          ) : (
            <PaginationPage
              key={page}
              href={createPageURL(page)}
              current={currentPage === page}
            >
              {page}
            </PaginationPage>
          )
        )}
      </PaginationList>

      {currentPage < totalPages ? (
        <PaginationNext href={createPageURL(currentPage + 1)} />
      ) : (
        <PaginationNext />
      )}
    </Pagination>
  );
}
