'use client';

import { Strong, Text } from '@/components/ui/text';
import clsx from 'clsx';
import { routes } from '@/lib/routes';
import Link from 'next/link';

const styles = [
  // Base
  'group w-full relative block rounded-lg p-12 text-center',
  // Background
  'bg-transparent hover:bg-primary/10',
  // Border
  'border-2 border-dashed border-zinc-950/10 text-zinc-950',
  // Dark mode
  'dark:border-white/15 dark:text-white',
  // Hover
  'hover:border-primary',
  // Cursor
  'cursor-pointer touch-manipulation pointer-events-auto',
];

export default function EmptyState({
  className,
  children,
} : {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      aria-label="Create a new game"
      className={clsx(className, styles)}
      href={routes.game.create}
    >
      {children || (
        <div className="flex flex-col items-center p-12">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto size-12 text-zinc-400 mb-2 "
          >
            <path
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Strong>Create your first game</Strong>
          <Text className="mt-2">
            You haven’t created a game yet. Click here to get started.
          </Text>
        </div>
      )}
    </Link>
  );
}
