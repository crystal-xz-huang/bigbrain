'use client';

import { Button } from '@/components/ui/button';
import { CardLayoutIcon, ListLayoutIcon } from '@/components/ui/icon';
import { RadioGroup } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import * as Headless from '@headlessui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const filterOptions = [
  { value: 'relevance+desc', label: 'Best match' },
  { value: 'name+asc', label: 'Name: A–Z' },
  { value: 'name+desc', label: 'Name: Z–A' },
  { value: 'createdAt+desc', label: 'Time: Newest first' },
  { value: 'createdAt+asc', label: 'Time: Oldest first' },
  { value: 'questionCount+desc', label: 'Question count: Highest' },
  { value: 'questionCount+asc', label: 'Question count: Lowest' },
  { value: 'duration+desc', label: 'Duration: Longest' },
  { value: 'duration+asc', label: 'Duration: Shortest' },
];

export function Filter({
  className,
  ...props
}: { placeholder?: string; className?: string } & Omit<
  Headless.SelectProps,
  'as' | 'onChange' | 'defaultValue'
>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sort = searchParams.get('sort') ?? 'publishedAt';
  const order = searchParams.get('order') ?? 'desc';
  const value = `${sort}+${order}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [nextSort, nextOrder] = e.target.value.split('+') as [string, string];
    const next = new URLSearchParams(searchParams);
    next.set('sort', nextSort);
    next.set('order', nextOrder);
    next.set('page', '1'); // reset pagination on change
    replace(`${pathname}?${next.toString()}`);
  };

  return (
    <Select
      {...props}
      className={className}
      aria-label="Sort and filter games"
      value={value}
      onChange={handleChange}
    >
      {filterOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}

export function LayoutFilter({
  className,
  ...props
}: { placeholder?: string; className?: string } & Omit<
  Headless.SelectProps,
  'as' | 'onChange' | 'defaultValue'
>) {
  return (
    <RadioGroup aria-label="Change list layout" className="flex items-center gap-1">
      <Headless.Radio
        as={Button}
        plain
        value="card"
        aria-label="Switch to card view"
        className="cursor-pointer group m-0! p-0!"
      >
        <span className="inline-block align-middle w-8 h-8">
          <CardLayoutIcon className="block pointer-events-none fill-(--btn-icon) group-hover:fill-blue-400" />
        </span>
      </Headless.Radio>
      <Headless.Radio
        as={Button}
        plain
        value="list"
        aria-label="Switch to list view"
        className="cursor-pointer group m-0! p-0!"
      >
        <span className="inline-block align-middle w-8 h-8">
          <ListLayoutIcon className="block pointer-events-none fill-(--btn-icon) group-hover:fill-blue-400" />
        </span>
      </Headless.Radio>
    </RadioGroup>
  );
}
