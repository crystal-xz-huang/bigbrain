import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Link } from './link';

const styles = {
  rounded: [
    '!rounded-full before:rounded-full after:rounded-full dark:after:rounded-full',
  ],
  base: [
    // Base
    'relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border text-base/6 font-semibold',
    // Sizing
    'px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)] sm:text-sm/6',
    // Cursor
    'cursor-pointer',
    // Focus
    'focus:not-data-focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500',
    // Disabled
    'data-disabled:opacity-50',
    // Icon
    '*:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) sm:*:data-[slot=icon]:my-1 sm:*:data-[slot=icon]:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText]',
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    'border-transparent bg-(--btn-border)',
    // Dark mode: border is rendered on `after` so background is set to button background
    'dark:bg-(--btn-bg)',
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg)',
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    'before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Dark mode: Subtle white outline is applied using a border
    'dark:border-white/5',
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    'after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)]',
    // Inner highlight shadow
    'after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
    // White overlay on hover
    'data-active:after:bg-(--btn-hover-overlay) data-hover:after:bg-(--btn-hover-overlay)',
    // Dark mode: `after` layer expands to cover entire button
    'dark:after:-inset-px dark:after:rounded-lg',
    // Disabled
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    // Base
    'border-zinc-950/10 text-zinc-950 data-active:bg-zinc-950/2.5 data-hover:bg-zinc-950/2.5',
    // Dark mode
    'dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-active:bg-white/5 dark:data-hover:bg-white/5',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  plain: [
    // Base
    'border-transparent text-zinc-950 data-active:bg-zinc-950/5 data-hover:bg-zinc-950/5',
    // Dark mode
    'dark:text-white dark:data-active:bg-white/10 dark:data-hover:bg-white/10',
    // Icon
    '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
  ],
  colors: {
    'dark/zinc': [
      'text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10',
      'dark:text-white dark:[--btn-bg:var(--color-zinc-600)] dark:[--btn-hover-overlay:var(--color-white)]/5',
      '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]',
    ],
    light: [
      'text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-active:[--btn-border:var(--color-zinc-950)]/15 data-hover:[--btn-border:var(--color-zinc-950)]/15',
      'dark:text-white dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]',
      '[--btn-icon:var(--color-zinc-500)] data-active:[--btn-icon:var(--color-zinc-700)] data-hover:[--btn-icon:var(--color-zinc-700)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
    ],
    'dark/white': [
      'text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10',
      'dark:text-zinc-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:var(--color-zinc-950)]/5',
      '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)] dark:[--btn-icon:var(--color-zinc-500)] dark:data-active:[--btn-icon:var(--color-zinc-400)] dark:data-hover:[--btn-icon:var(--color-zinc-400)]',
    ],
    dark: [
      'text-white [--btn-bg:var(--color-zinc-900)] [--btn-border:var(--color-zinc-950)]/90 [--btn-hover-overlay:var(--color-white)]/10',
      'dark:[--btn-hover-overlay:var(--color-white)]/5 dark:[--btn-bg:var(--color-zinc-800)]',
      '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]',
    ],
    white: [
      'text-zinc-950 [--btn-bg:white] [--btn-border:var(--color-zinc-950)]/10 [--btn-hover-overlay:var(--color-zinc-950)]/2.5 data-active:[--btn-border:var(--color-zinc-950)]/15 data-hover:[--btn-border:var(--color-zinc-950)]/15',
      'dark:[--btn-hover-overlay:var(--color-zinc-950)]/5',
      '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-500)] data-hover:[--btn-icon:var(--color-zinc-500)]',
    ],
    zinc: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-zinc-600)] [--btn-border:var(--color-zinc-700)]/90',
      'dark:[--btn-hover-overlay:var(--color-white)]/5',
      '[--btn-icon:var(--color-zinc-400)] data-active:[--btn-icon:var(--color-zinc-300)] data-hover:[--btn-icon:var(--color-zinc-300)]',
    ],
    indigo: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-indigo-500)] [--btn-border:var(--color-indigo-600)]/90',
      '[--btn-icon:var(--color-indigo-300)] data-active:[--btn-icon:var(--color-indigo-200)] data-hover:[--btn-icon:var(--color-indigo-200)]',
    ],
    cyan: [
      'text-cyan-950 [--btn-bg:var(--color-cyan-300)] [--btn-border:var(--color-cyan-400)]/80 [--btn-hover-overlay:var(--color-white)]/25',
      '[--btn-icon:var(--color-cyan-500)]',
    ],
    red: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-red-600)] [--btn-border:var(--color-red-700)]/90',
      '[--btn-icon:var(--color-red-300)] data-active:[--btn-icon:var(--color-red-200)] data-hover:[--btn-icon:var(--color-red-200)]',
    ],
    orange: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-orange-500)] [--btn-border:var(--color-orange-600)]/90',
      '[--btn-icon:var(--color-orange-300)] data-active:[--btn-icon:var(--color-orange-200)] data-hover:[--btn-icon:var(--color-orange-200)]',
    ],
    amber: [
      'text-amber-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-amber-400)] [--btn-border:var(--color-amber-500)]/80',
      '[--btn-icon:var(--color-amber-600)]',
    ],
    yellow: [
      'text-yellow-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-yellow-300)] [--btn-border:var(--color-yellow-400)]/80',
      '[--btn-icon:var(--color-yellow-600)] data-active:[--btn-icon:var(--color-yellow-700)] data-hover:[--btn-icon:var(--color-yellow-700)]',
    ],
    lime: [
      'text-lime-950 [--btn-hover-overlay:var(--color-white)]/25 [--btn-bg:var(--color-lime-300)] [--btn-border:var(--color-lime-400)]/80',
      '[--btn-icon:var(--color-lime-600)] data-active:[--btn-icon:var(--color-lime-700)] data-hover:[--btn-icon:var(--color-lime-700)]',
    ],
    green: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-green-600)] [--btn-border:var(--color-green-700)]/90',
      '[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80',
    ],
    emerald: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-emerald-600)] [--btn-border:var(--color-emerald-700)]/90',
      '[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80',
    ],
    teal: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-teal-600)] [--btn-border:var(--color-teal-700)]/90',
      '[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80',
    ],
    sky: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-sky-500)] [--btn-border:var(--color-sky-600)]/80',
      '[--btn-icon:var(--color-white)]/60 data-active:[--btn-icon:var(--color-white)]/80 data-hover:[--btn-icon:var(--color-white)]/80',
    ],
    blue: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-blue-600)] [--btn-border:var(--color-blue-700)]/90',
      '[--btn-icon:var(--color-blue-400)] data-active:[--btn-icon:var(--color-blue-300)] data-hover:[--btn-icon:var(--color-blue-300)]',
    ],
    violet: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-violet-500)] [--btn-border:var(--color-violet-600)]/90',
      '[--btn-icon:var(--color-violet-300)] data-active:[--btn-icon:var(--color-violet-200)] data-hover:[--btn-icon:var(--color-violet-200)]',
    ],
    purple: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-purple-500)] [--btn-border:var(--color-purple-600)]/90',
      '[--btn-icon:var(--color-purple-300)] data-active:[--btn-icon:var(--color-purple-200)] data-hover:[--btn-icon:var(--color-purple-200)]',
    ],
    fuchsia: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-fuchsia-500)] [--btn-border:var(--color-fuchsia-600)]/90',
      '[--btn-icon:var(--color-fuchsia-300)] data-active:[--btn-icon:var(--color-fuchsia-200)] data-hover:[--btn-icon:var(--color-fuchsia-200)]',
    ],
    pink: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-pink-500)] [--btn-border:var(--color-pink-600)]/90',
      '[--btn-icon:var(--color-pink-300)] data-active:[--btn-icon:var(--color-pink-200)] data-hover:[--btn-icon:var(--color-pink-200)]',
    ],
    rose: [
      'text-white [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-rose-500)] [--btn-border:var(--color-rose-600)]/90',
      '[--btn-icon:var(--color-rose-300)] data-active:[--btn-icon:var(--color-rose-200)] data-hover:[--btn-icon:var(--color-rose-200)]',
    ],
    gray: [
      'text-black [--btn-bg:var(--color-black)]/10 [--btn-border:var(--color-zinc-800)]/0 [--btn-hover-overlay:var(--color-white)]/20',
      '[--btn-icon:var(--color-black)] data-active:[--btn-icon:var(--color-black)]/80 data-hover:[--btn-icon:var(--color-black)]/80',
    ],
    primary: [
      'text-primary-content [--btn-hover-overlay:var(--color-white)]/10 [--btn-bg:var(--color-primary-300)] [--btn-border:var(--color-primary-400)]/90',
      '[--btn-icon:var(--color-primary-300)] data-active:[--btn-icon:var(--color-primary-200)] data-hover:[--btn-icon:var(--color-primary-200)]',
    ],
  },
};

export type ButtonColor = keyof typeof styles.colors;

type ButtonProps = (
  | {
      color?: keyof typeof styles.colors;
      outline?: never;
      plain?: never;
      rounded?: boolean;
    }
  | { color?: never; outline: true; plain?: never; rounded?: boolean }
  | { color?: never; outline?: never; plain: true; rounded?: boolean }
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  );

export const Button = forwardRef(function Button(
  {
    rounded,
    color,
    outline,
    plain,
    className,
    children,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    styles.base,
    rounded && styles.rounded,
    outline
      ? styles.outline
      : plain
      ? styles.plain
      : clsx(styles.solid, styles.colors[color ?? 'dark/zinc'])
  );

  return 'href' in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      {...props}
      className={clsx(classes, 'cursor-default')}
      ref={ref}
    >
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  );
});

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}

/***************************************************************
                     Loading Button
***************************************************************/
export function ButtonLoading(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <Button disabled aria-disabled {...rest}>
      <div className="flex items-center justify-center">
        <svg
          className="size-5 animate-spin motion-reduce:hidden text-current mr-2 -ml-1"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {children || 'Loading...'}
      </div>
    </Button>
  );
}

/***************************************************************
                     Primary Button
***************************************************************/
const primary_styles = {
  base: [
    // Typography
    'font-sans tracking-wide font-black whitespace-nowrap text-base md:text-lg',
    // Base
    'relative flex items-center justify-center',
    // Cursor
    'cursor-pointer pointer-events-auto group touch-manipulation ',
    // Disabled
    'data-disabled:pointer-events-none',
  ],
  solid: [
    // Base
    'relative isolate flex rounded-none',
    // Color
    'text-black',
    // Sizing
    // 'md:px-8 w-full md:w-80 h-12 px-6 py-0',
  ],
  plain: [
    // Base
    'relative overflow-hidden rounded-full',
    // Color
    'text-black bg-black/10',
    // Disabled
    'data-disabled:opacity-50',
  ],
  colors: {
    zinc: 'bg-zinc-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500',
    orange: 'bg-[#ffc679]',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-[#c6ea84]',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-300',
    rose: 'bg-rose-500',
    white: 'bg-white',
  },
};

function PrimaryTouchTarget({
  color,
  disabled = false,
  children,
}: {
  color?: keyof typeof primary_styles.colors;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="-inset-1 absolute z-0 rounded-[2.9375rem]" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black rounded-[3.125rem] p-[0.25rem]">
        <div className="relative w-full h-full">
          <div
            className={clsx(
              'top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[2.8125rem]',
              primary_styles.colors[color ?? 'orange']
            )}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div
            className={clsx(
              'bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[2.8125rem]',
              primary_styles.colors[color ?? 'orange']
            )}
          >
            <div className="group-hover:bg-white/20 absolute inset-0" />
          </div>
        </div>
      </div>
      {disabled && (
        <div className="z-1 absolute inset-0 overflow-hidden rounded-[2.8125rem]">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
        </div>
      )}
      <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 p-[0.25rem]">
        <div className="flex flex-col flex-1 items-center">
          <div className="relative">{children}</div>
        </div>
      </div>
    </>
  );
}

export const ButtonPrimary = forwardRef(function Button(
  {
    color,
    className,
    children,
    ...props
  }: { color?: keyof typeof primary_styles.colors } & {
    className?: string;
    children: React.ReactNode;
  } & (
      | Omit<Headless.ButtonProps, 'as' | 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(className, primary_styles.base, primary_styles.solid);
  const isDisabled = props.disabled === true;

  return 'href' in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <PrimaryTouchTarget color={color} disabled={isDisabled}>
        {children}
      </PrimaryTouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <PrimaryTouchTarget color={color} disabled={isDisabled}>
        {children}
      </PrimaryTouchTarget>
    </Headless.Button>
  );
});

export function ButtonClose({
  className,
  ...props
}: {
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Headless.Button
      type="button"
      className={clsx(
        className,
        'bg-black/20 min-w-[1.5rem] h-6 flex flex-col justify-center items-center rounded-full pr-0 pl-0 cursor-pointer'
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className="w-4 h-4 text-black opacity-50"
      >
        <path
          fill="currentColor"
          d="m16.4 20-9.09-9.08a2.65 2.65 0 0 1 0-3.58 2.63 2.63 0 0 1 3.58 0L20 16.4l9.07-9.08a2.542 2.542 0 0 1 3.59 3.6L23.6 20l9.07 9.08a2.54 2.54 0 0 1-3.59 3.59L20 23.6l-9.09 9.09a2.553 2.553 0 0 1-3.61-3.61z"
        />
      </svg>
    </Headless.Button>
  );
}
