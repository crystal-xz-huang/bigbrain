import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import React, { forwardRef } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'

import { getInitials, isEmptyString } from '@/lib/utils'
import type { User } from 'next-auth'

export type AvatarProps = {
  src?: string | null
  square?: boolean
  initials?: string
  alt?: string
  className?: string
}

export function Avatar({
  src = null,
  square = false,
  initials,
  alt = '',
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] *:col-start-1 *:row-start-1',
        'outline -outline-offset-1 outline-black/10 dark:outline-white/10',
        // Border radius
        square ? 'rounded-(--avatar-radius) *:rounded-(--avatar-radius)' : 'rounded-full *:rounded-full'
      )}
    >
      {initials && (
        <svg
          className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em">
            {initials}
          </text>
        </svg>
      )}
      {src && <Image className="size-full" src={src} alt={alt} />}
    </span>
  )
}

export const AvatarButton = forwardRef(function AvatarButton(
  {
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
  }: AvatarProps &
    (Omit<Headless.ButtonProps, 'as' | 'className'> | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    square ? 'rounded-[20%]' : 'rounded-full',
    'relative inline-grid focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500'
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar src={src} square={square} initials={initials} alt={alt} />
      </TouchTarget>
    </Headless.Button>
  )
})

export function AvatarDefault( { className, ...props } : { className?: string }) {
  return (
    <span className={clsx('inline-block overflow-hidden rounded-full bg-zinc-800 dark:bg-zinc-100', className)} {...props}>
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className="text-zinc-100 dark:text-zinc-500"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
}

export function AvatarUser({
  user,
  className,
  ...props
}: {
  user: User | null;
  className?: string;
}) {
  // If user is null, return default avatar
  if (!user) {
    return <AvatarDefault className={className} {...props} />;
  }

  // If user has no image, show initials
  const initials = getInitials(user.name as string);
  if (isEmptyString(initials)) {
    return <AvatarDefault className={className} {...props} />;
  }

  // Otherwise, show avatar with initials or image
  return (
    <Avatar
      square
      className={clsx([
        className,
        user.image && 'bg-zinc-900 text-white dark:bg-white dark:text-black',
      ])}
      alt={user.name || ''}
      {...(user.image ? { src: user.image } : { initials: initials })}
      {...props}
    />
  );
}
