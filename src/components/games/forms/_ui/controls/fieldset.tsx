import * as Headless from '@headlessui/react';
import clsx from 'clsx';

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col w-full space-y-0 gap-2 md:flex-row md:flex-wrap'
      )}
    />
  );
}

export function Label({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      className={clsx(
        className,
        'text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white',
        'font-bold text-sm sm:text-xs whitespace-nowrap'
      )}
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
        'w-full flex-1 col-span-1 flex items-center justify-between gap-3 px-4 py-2 bg-black/10 dark:bg-black/30 rounded-lg'
      )}
    />
  );
}
