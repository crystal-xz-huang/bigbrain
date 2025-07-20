import { Link } from '@/components/ui/link';
import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

const styles = {
  base: [
    // Base
    'relative isolate flex group text-black touch-manipulation whitespace-nowrap text-base font-bold',
    // Sizing
    'md:px-8 w-full md:w-80 h-12 px-6 py-0',
    // Cursor
    'cursor-pointer pointer-events-auto',
    // Disabled
    'data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:pointer-events-none',
  ],
  colors: {
    indigo: 'bg-indigo-500',
    cyan: 'bg-cyan-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-300',
    error: 'bg-rose-500',
  }
};

function TouchTarget({ color, children }: { color?: keyof typeof styles.colors; children: React.ReactNode }) {
  const colorClass = styles.colors[color || 'pink'];

  return (
    <>
      <div className="-inset-1 absolute z-0 rounded-[2.9375rem]" />
      <div className="absolute inset-x-0 top-0 bottom-0 transform group-active:translate-y-0.5 group-active:bottom-0.5 z-1 bg-black p-[0.1875rem] rounded-[3.125rem]">
        <div className="relative w-full h-full">
          <div
            className={clsx(
              'top-1 absolute inset-x-0 bottom-0 overflow-hidden rounded-[2.8125rem]',
              colorClass
            )}
          >
            <div className="bg-opacity-30 absolute inset-0 bg-black" />
          </div>
          <div
            className={clsx(
              'bottom-1 absolute inset-x-0 top-0 overflow-hidden group-active:bottom-0.5 rounded-[2.8125rem]',
              colorClass
            )}
          >
            <div className="group-hover:bg-opacity-20 absolute inset-0" />
          </div>
        </div>
      </div>

      <div className="relative flex flex-row gap-x-4 items-center w-full min-h-full pointer-events-none z-2 transform -translate-y-0.5 group-active:translate-y-0 p-[0.1875rem]">
        <div className="flex flex-col flex-1 items-center">
          <div className="relative">{children}</div>
        </div>
      </div>
    </>
  );
}

type ButtonProps = (
  | { color?: keyof typeof styles.colors;}
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  );

export const Button = forwardRef(function Button(
  { color, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(className, styles.base);

  return 'href' in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget color={color}>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      {...props}
      className={classes}
      ref={ref}
    >
      <TouchTarget color={color}>{children}</TouchTarget>
    </Headless.Button>
  );
});