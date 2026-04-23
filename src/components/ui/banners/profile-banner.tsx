import { Avatar, type AvatarProps } from '@/components/ui/avatar';
import { ButtonPrimary } from '@/components/ui/button';
import type { HeadingProps } from '@/components/ui/heading';
import clsx from 'clsx';
import React from 'react';
import { UserIcon } from '@heroicons/react/20/solid';

export function Banner({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'rounded-xl shadow-xl font-sans tracking-wide outline-1 outline-zinc-950/10 bg-white overflow-hidden'
      )}
      {...props}
    />
  );
}

export function BannerHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={clsx('sm:flex sm:space-x-5', className)} {...props} />;
}

export function BannerAvatar({ className, ...props }: AvatarProps) {
  const styles = ['mx-auto size-20 rounded-full', className];
  return (
    <div className="shrink-0 flex items-center justify-center">
      {props ? (
        <Avatar {...props} className={clsx(styles)} />
      ) : (
        <UserIcon
          className={clsx(styles, 'bg-neutral stroke-white fill-white')}
        />
      )}
    </div>
  );
}

export function BannerTitle({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      {...props}
      className={clsx(
        className,
        'md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-2xl font-bold leading-none'
      )}
    />
  );
}

export function BannerDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-600 font-semibold'
      )}
      {...props}
    />
  );
}

export function BannerContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'p-6 sm:flex sm:items-center sm:justify-between',
        className
      )}
      {...props}
    />
  );
}

export function BannerAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'mt-5 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3',
        className
      )}
      {...props}
    />
  );
}

export function BannerButton({
  className,
  ...props
}: React.ComponentProps<typeof ButtonPrimary>) {
  return (
    <ButtonPrimary
      {...props}
      className={clsx(
        'py-3 md:h-14 whitespace-nowrap md:px-6 md:w-auto md:py-0 px-6 min-w-[7rem] md:min-w-[12rem]',
        className
      )}
    />
  );
}

export function BannerFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 divide-y divide-zinc-950/5 dark:divide-white/5 border-t border-zinc-950/5 dark:border-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0',
        className
      )}
      {...props}
    />
  );
}
