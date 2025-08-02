import { Link } from '@/components/ui/link';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

const styles = {
  base: [
    // Typography
    'font-sans tracking-wide font-black whitespace-nowrap text-base md:text-lg',
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
  },
};

function TouchTarget({
  plain,
  color,
  disabled = false,
  children,
}: {
  plain?: boolean;
  color?: keyof typeof styles.colors;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return plain ? (
    <>
      {children}
      <div className="bg-white absolute inset-0 opacity-0 group-hover:opacity-20" />
    </>
  ) : (
    <>
      <div className="-inset-1 absolute z-0 rounded-[2.9375rem]" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black rounded-[3.125rem] p-[0.25rem]">
        <div className="relative w-full h-full">
          <div
            className={clsx(
              'top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[2.8125rem]',
              styles.colors[color ?? 'orange']
            )}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div
            className={clsx(
              'bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[2.8125rem]',
              styles.colors[color ?? 'orange']
            )}
          >
            <div className="group-hover:bg-white/20 absolute inset-0" />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'z-1 absolute inset-0 overflow-hidden rounded-[2.8125rem]',
          disabled ? '' : 'hidden'
        )}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
      </div>
      <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 p-[0.25rem]">
        <div className="flex flex-col flex-1 items-center">
          <div className="relative">{children}</div>
        </div>
      </div>
    </>
  );
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors; plain?: never }
  | { color?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  );

export const Button = forwardRef(function Button(
  { color, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    styles.base,
    plain ? styles.plain : styles.solid
  );

  const isDisabled = 'disabled' in props;

  return 'href' in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget color={color} plain={plain} disabled={isDisabled}>
        {children}
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget color={color} plain={plain} disabled={isDisabled}>
        {children}
      </TouchTarget>
    </Headless.Button>
  );
});
