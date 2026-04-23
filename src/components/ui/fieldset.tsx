import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import type React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      className={clsx(
        className,
        '*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6'
      )}
    />
  );
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, 'as' | 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        'text-base/6 font-semibold text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white'
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(className, 'space-y-8')}
    />
  );
}

export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(
        className,
        '[&>[data-slot=label]+[data-slot=control]]:mt-3',
        '[&>[data-slot=label]+[data-slot=description]]:mt-1',
        '[&>[data-slot=description]+[data-slot=control]]:mt-3',
        '[&>[data-slot=control]+[data-slot=description]]:mt-3',
        '[&>[data-slot=control]+[data-slot=error]]:mt-3',
        '*:data-[slot=label]:font-medium'
      )}
    />
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
        'text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white',
        required && 'after:ml-0.5 after:text-rose-500 after:content-["*"]'
      )}
    />
  );
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps,
  'as' | 'className'
>) {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400'
      )}
    />
  );
}

export function ErrorMessage({
  className,
  icon = false,
  ...props
}: { className?: string; icon?: boolean; children?: React.ReactNode } & Omit<
  Headless.DescriptionProps,
  'as' | 'className' | 'children'
>) {
  if (icon) {
    return (
      <Headless.Description
        data-slot="error"
        {...props}
        className={clsx(
          className,
          'flex items-center text-base/6 text-glow-red-400 data-disabled:opacity-50 sm:text-sm/6 dark:text-glow-red-800'
        )}
      >
        <XCircleIcon
          aria-hidden="true"
          className="stroke-2 pointer-events-none mr-2 size-5"
        />
        {props.children}
      </Headless.Description>
    );
  }

  return (
    <Headless.Description
      data-slot="error"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-glow-red-400 data-disabled:opacity-50 sm:text-sm/6 dark:text-glow-red-800'
      )}
    />
  );
}
