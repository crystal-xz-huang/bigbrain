'use client';

import type { HeadingProps } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

const styles = {
  base: [
    'relative z-0 flex flex-col w-full h-full py-4 justify-start items-start text-left ',
    'font-sans tracking-wide font-black leading-tight text-base text-black',
  ],
  colors: {
    default: 'bg-black/10 dark:bg-white/90',
    invalid: 'bg-error/20',
  },
};

type CardProps = {
  invalid?: boolean;
} & { className?: string; children: React.ReactNode } & (
    | React.ComponentProps<'div'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  );

export function Card({ invalid = false, children, ...props }: CardProps) {
  const classes = clsx(
    styles.base,
    invalid ? styles.colors.invalid : styles.colors.default,
    'href' in props && 'cursor-pointer',
  );
  return (
    <div className="xl:w-1/3 lg:w-1/2 w-full px-2 mb-4">
      <div className="relative w-full h-full bg-black/10 dark:bg-white/90 rounded-lg overflow-hidden">
        {'href' in props ? (
          <Link {...props} className={classes}>
            {children}
          </Link>
        ) : (
          <div className={classes}>{children}</div>
        )}
      </div>
    </div>
  );
}

export function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-[calc(100%+1rem)] flex-wrap items-stretch -mx-2">
      {children}
    </div>
  );
}


export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-2 absolute top-0 left-0 size-12 overflow-hidden">
      <div className="left-1/2 top-1/2 absolute whitespace-nowrap tracking-normal transform -translate-x-1/2 -translate-y-1/2 text-2xl">
        {children}
      </div>
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-grow-0 w-full">
      <div className="mx-4 space-y-4 mt-10 mb-5">{children}</div>
    </div>
  );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-end flex-grow w-full">
      <div className="relative w-full h-[1px] bg-black opacity-10 mb-4" />
      <div className="text-sm font-normal leading-4 opacity-70 px-4 min-h-12">
        {children}
      </div>
    </div>
  );
}

export function CardTitle({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(className, 'font-black leading-tight')}
    />
  );
}

export function AnswerList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(className, 'flex flex-col space-y-1')}>{children}</div>
  );
}

export function AnswerItem({
  value,
  isCorrect = false,
}: {
  value: string;
  isCorrect?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex flex-row items-center justify-start space-x-2 text-base',
        isCorrect ? 'font-bold text-success' : 'font-medium text-error'
      )}
    >
      {isCorrect ? (
        <CheckIcon className="flex flex-shrink-0 size-4 stroke-4" />
      ) : (
        <div className="flex flex-shrink-0 size-4" />
      )}
      <p>{value}</p>
    </div>
  );
}
