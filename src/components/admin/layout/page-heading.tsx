'use client';

import { Heading } from '@/components/ui/heading';

export default function PageHeading({
  heading,
  children,
}: {
  heading: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <Heading>{heading}</Heading>
      {children}
    </div>
  );
}
