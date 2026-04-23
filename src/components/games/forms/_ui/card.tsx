import clsx from 'clsx';
import React from 'react';

export function Card({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        // layout
        'flex flex-col min-w-0 h-full w-full gap-1',
        // card content
        '[&>[data-slot=card-content]]:rounded-md',
        '[&>[data-slot=card-header]+[data-slot=card-content]]:rounded-t-none '
      )}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={clsx(
        className,
        // layout & background
        'bg-zinc-950/5 dark:bg-white/5 rounded-t-md w-full p-4 h-14',
        // typography
        'font-bold text-sm/6 text-zinc-500 dark:text-zinc-400',
        // layout
        'flex items-center justify-between',
        // children (card action)
        '**:data-[slot=card-action]:justify-end'
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={clsx('leading-none text-lg', className)}
      {...props}
    />
  );
}

export function CardAction({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(className, 'h-full flex flex-col justify-center')}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={clsx(
        className,
        // layout
        'p-4 gap-4 flex flex-col w-full h-full min-w-0',
        // background
        'bg-zinc-950/5 dark:bg-white/5'
      )}
      {...props}
    />
  );
}
