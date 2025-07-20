'use client';

import { StatusIndicator } from '@/components/ui/indicator';
import clsx from 'clsx';
import React from 'react';

export function Card({
  active,
  children,
  ...props
}: {
  active?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={clsx([
        'relative rounded-xl p-1 flex flex-col gap-4 h-full',
        active && 'bg-emerald-500/5 outline-2 outline-emerald-500/50',
        className,
      ])}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-[75%] relative w-full h-full">
      <div className="md:rounded-xl z-1 absolute top-0 left-0 block w-full h-full overflow-hidden rounded-lg">
        {children}
      </div>
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-b-xl flex flex-col w-full space-y-0.5 bg-transparent">
      {children}
    </div>
  );
}

export function CardIndicator({ active }: { active?: boolean }) {
  if (!active) return null;

  return (
    <div className="z-10 absolute -top-2 -right-2">
      <StatusIndicator color="green" size="md" />
    </div>
  );
}

export function CardBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white text-xs md:text-sm rounded-br-lg z-1 absolute left-0 top-0 p-3 leading-none font-bold bg-active select-none">
      <span className="md:inline-block hidden pl-1">{children}</span>
    </div>
  );
}
