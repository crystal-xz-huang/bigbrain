'use client';

import * as Headless from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

/***************************************************************
                    Form Controls with Inset Label
***************************************************************/
export function ControlLabelGroup({
  children,
  className,
}: React.ComponentPropsWithoutRef<'div'> & { children: React.ReactNode }) {
  return (
    <div
      data-slot="control"
      className={clsx(
        className,
        // Basic layout
        'relative block rounded-md px-3 pt-2.5 pb-1.5',
        // Background color
        'bg-white dark:bg-white/5',
        // Outline
        'outline-1 -outline-offset-1 outline-zinc-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-accent',
        // Invalid state
        'has-data-invalid:outline-rose-300 has-data-invalid:focus:outline-rose-600 dark:has-data-invalid:outline-error dark:has-data-invalid:focus:outline-error',
        // Disabled state
        'has-data-disabled:bg-zinc-50'
      )}
    >
      {children}
    </div>
  );
}

export function Label({
  className,
  required,
  ...props
}: { className?: string; required?: boolean } & Omit<
  Headless.LabelProps,
  'as' | 'className'
>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'block text-sm sm:text-xs font-medium text-zinc-700 dark:text-zinc-300 select-none data-disabled:opacity-50',
        required && 'after:ml-0.5 after:text-rose-500 after:content-["*"]'
      )}
    />
  );
}

export function ErrorMessage({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.DescriptionProps,
  'as' | 'className'
>) {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={clsx(
        className,
        'flex items-center gap-2',
        'text-base/6 sm:text-sm/6 text-rose-600 data-disabled:opacity-50 dark:text-rose-500'
      )}
    >
      <ExclamationCircleIcon
        aria-hidden="true"
        className="pointer-events-none size-4 text-rose-500"
      />
      {children}
    </Headless.Description>
  );
}

/***************************************************************
                     Input
***************************************************************/
export const Input = forwardRef(function Input(
  { ...props }: {} & Omit<Headless.InputProps, 'as' | 'className'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <Headless.Input
      data-slot="control"
      ref={ref}
      {...props}
      className={clsx(
        // Basic layout
        'block w-full focus:outline-none bg-transparent',
        // Typography
        'text-base/6 sm:text-sm/6 text-zinc-900 placeholder:text-zinc-400 dark:text-white',
        // Invalid state
        'data-invalid:placeholder:text-red-300',
        // Disabled state
        'data-disabled:opacity-50'
      )}
    />
  );
});

/***************************************************************
                     Textarea
***************************************************************/
export const Textarea = forwardRef(function Textarea(
  {
    className,
    ...props
  }: { className?: string } & Omit<Headless.TextareaProps, 'as' | 'className'>,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <Headless.Textarea
      data-slot="control"
      ref={ref}
      {...props}
      className={clsx(
        className,
        // Basic layout
        'block w-full focus:outline-none bg-transparent',
        // Typography
        'text-base/6 sm:text-sm/6 text-zinc-900 placeholder:text-zinc-400 dark:text-white',
        // Invalid state
        'data-invalid:placeholder:text-red-300',
        // Disabled state
        'data-disabled:opacity-50'
      )}
    />
  );
});
