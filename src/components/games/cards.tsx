'use client';

import { StatusIndicator } from '@/components/ui/indicator';
import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

/***************************************************************
                     Card Components
***************************************************************/
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'relative rounded-xl pb-4 pr-2 space-y-1 flex flex-col h-full w-full',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ children }: React.ComponentProps<'div'>) {
  return (
    <div className="relative w-full aspect-[4/3]">
      <div className="md:rounded-xl z-1 absolute top-0 left-0 block w-full h-full overflow-hidden rounded-lg font-sans tracking-wide font-bold">
        {children}
      </div>
    </div>
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={clsx('flex flex-col w-full space-y-1', className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: { className?: string } & (
  | Omit<React.ComponentProps<typeof Text>, 'as' | 'className'>
  | Omit<React.ComponentProps<typeof Link>, 'as' | 'className'>
)) {
  return 'href' in props ? (
    <Link
      {...props}
      className={clsx(
        'line-clamp-1 font-bold text-sm/6 hover:underline',
        className
      )}
    />
  ) : (
    <Text
      {...props}
      className={clsx('line-clamp-1 font-bold text-sm/6', className)}
    />
  );
}

function CardIndicator({ active }: { active?: boolean }) {
  return active ? (
    <div className="z-10 absolute -top-2 -right-2">
      <StatusIndicator color="green" size="md" />
    </div>
  ) : null;
}

function CardBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white text-xs md:text-sm opacity-90 bg-black/70 rounded-br-md z-3 absolute left-0 top-0 p-2 leading-none font-bold select-none">
      <span className="md:inline-block hidden pl-1">{children}</span>
    </div>
  );
}

function CardAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-2 absolute top-0 left-0 w-full h-full visible">
      <div className="z-3 absolute inset-0 flex flex-row items-center justify-center transition-opacity duration-300 ease-in-out bg-black/50 opacity-0 hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

function CardThumbnail({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = React.useState(false);

  if (error || !src) {
    return (
      <div className="bg-zinc-200 flex flex-col items-center justify-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          className="text-opacity-20 w-24 h-24 mx-auto text-zinc-400"
        >
          <path
            fill="currentColor"
            d="M17.78 22.41a2.19 2.19 0 0 0 1.15.32 2.23 2.23 0 0 0 1.17-.32 2.31 2.31 0 0 0 .85-.85 2.33 2.33 0 0 0 0-2.32 2.39 2.39 0 0 0-.85-.85 2.23 2.23 0 0 0-1.17-.32 2.19 2.19 0 0 0-1.15.32 2.44 2.44 0 0 0-.84.85 2.33 2.33 0 0 0 0 2.32 2.36 2.36 0 0 0 .84.85Z"
          ></path>
          <path
            fill="currentColor"
            d="M32.42 15.1a3.47 3.47 0 0 0-2.54-.86H27.7l-.59-3.33a3.41 3.41 0 0 0-1.29-2.32 3.4 3.4 0 0 0-2.65-.41L8.56 10.76A3.43 3.43 0 0 0 6.22 12a3.45 3.45 0 0 0-.41 2.63l1.78 10.23a3.35 3.35 0 0 0 1.29 2.32 3.44 3.44 0 0 0 2.65.4h.12V28a3.43 3.43 0 0 0 .86 2.51 3.49 3.49 0 0 0 2.54.86h14.83a3.47 3.47 0 0 0 2.54-.86 3.43 3.43 0 0 0 .86-2.51V17.61a3.43 3.43 0 0 0-.86-2.51Zm-1.68 1.68a1.39 1.39 0 0 1 .36 1v7.94l-3.6-3.32a2 2 0 0 0-1.44-.58 2.12 2.12 0 0 0-.75.14 2.37 2.37 0 0 0-.68.42l-4.33 3.84-1.73-1.57a2.51 2.51 0 0 0-.62-.4 1.64 1.64 0 0 0-.68-.15 1.52 1.52 0 0 0-.63.14 2.21 2.21 0 0 0-.61.4l-2.19 1.94v-8.75a1.39 1.39 0 0 1 .36-1 1.43 1.43 0 0 1 1-.35h14.51a1.43 1.43 0 0 1 1.03.3ZM11.33 25.4a1.41 1.41 0 0 1-1.08-.17 1.35 1.35 0 0 1-.53-1L8 14.5a1.36 1.36 0 0 1 .16-1.1 1.41 1.41 0 0 1 1-.51l14.27-2.52a1.36 1.36 0 0 1 1.06.16 1.41 1.41 0 0 1 .54 1l.48 2.73H15.05a3.49 3.49 0 0 0-2.54.86 3.41 3.41 0 0 0-.86 2.51v7.73Z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 z-0 w-full h-full">
      <div className="relative inset-0 flex items-center justify-center w-full h-full overflow-hidden bg-zinc-200 z-1">
        <div className="absolute w-full h-full">
          <Image
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

export {
  Card,
  CardAction,
  CardBadge,
  CardContent,
  CardHeader,
  CardIndicator,
  CardThumbnail,
  CardTitle,
};
