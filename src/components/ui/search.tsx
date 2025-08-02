'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input, InputGroup } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <InputGroup>
      <MagnifyingGlassIcon aria-hidden="true" />
      <Input
        name="search"
        type="search"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </InputGroup>
  );
}
