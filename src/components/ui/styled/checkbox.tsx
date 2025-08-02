import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import type React from 'react';

export function CheckboxGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        'md:mt-0 md:rounded-xl flex flex-row py-4 ml-0.5 space-x-6'
      )}
    />
  );
}

export function CheckboxField({
  children,
  className,
  ...props
}: { children?: React.ReactNode; className?: string } & Omit<
  Headless.FieldProps,
  'as' | 'className'
>) {
  return (
    <Headless.Field
      data-slot="field"
      className={clsx(className, 'relative block')}
      {...props}
    >
      <div className="flex flex-row items-center space-x-2">{children}</div>
    </Headless.Field>
  );
}

const base = [
  // Basic layout
  'relative isolate size-5 overflow-hidden flex justify-center items-center rounded-[0.25rem] cursor-pointer',
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.25rem-1px)] before:bg-white before:shadow-sm',
  // Background color when checked
  'group-data-checked:before:bg-(--checkbox-checked-bg)',
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  'dark:before:hidden',
  // Background color applied to control in dark mode
  'dark:bg-white/5 dark:group-data-checked:bg-(--checkbox-checked-bg)',
  // Border
  'border-1 border-black dark:border-white/15',
  // Inner highlight shadow
  'after:absolute after:inset-0 after:rounded-[calc(0.25rem-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)]',
  'dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.25rem] dark:group-data-checked:after:block',
  // Focus ring
  'group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
  // Disabled state
  'group-data-disabled:opacity-50',
  'group-data-disabled:border-black/25 group-data-disabled:bg-black/5 group-data-disabled:[--checkbox-check:var(--color-black)]/50 group-data-disabled:before:bg-transparent',
  'dark:group-data-disabled:border-white/20 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:[--checkbox-check:var(--color-white)]/50 dark:group-data-checked:group-data-disabled:after:hidden',
  // Forced colors mode
  'forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
  'dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-disabled:[--checkbox-check:Highlight]',
];

const colors = {
  'dark/zinc': [
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
    'dark:[--checkbox-checked-bg:var(--color-zinc-600)]',
  ],
  'dark/white': [
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
    'dark:[--checkbox-check:var(--color-zinc-900)] dark:[--checkbox-checked-bg:var(--color-white)] dark:[--checkbox-checked-border:var(--color-zinc-950)]/15',
  ],
  white:
    '[--checkbox-check:var(--color-zinc-900)] [--checkbox-checked-bg:var(--color-white)] [--checkbox-checked-border:var(--color-zinc-950)]/15',
  dark: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-900)] [--checkbox-checked-border:var(--color-zinc-950)]/90',
  zinc: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-zinc-600)] [--checkbox-checked-border:var(--color-zinc-700)]/90',
  red: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-red-600)] [--checkbox-checked-border:var(--color-red-700)]/90',
  orange:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-orange-500)] [--checkbox-checked-border:var(--color-orange-600)]/90',
  amber:
    '[--checkbox-check:var(--color-amber-950)] [--checkbox-checked-bg:var(--color-amber-400)] [--checkbox-checked-border:var(--color-amber-500)]/80',
  yellow:
    '[--checkbox-check:var(--color-yellow-950)] [--checkbox-checked-bg:var(--color-yellow-300)] [--checkbox-checked-border:var(--color-yellow-400)]/80',
  lime: '[--checkbox-check:var(--color-lime-950)] [--checkbox-checked-bg:var(--color-lime-300)] [--checkbox-checked-border:var(--color-lime-400)]/80',
  green:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-green-600)] [--checkbox-checked-border:var(--color-green-700)]/90',
  emerald:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-emerald-600)] [--checkbox-checked-border:var(--color-emerald-700)]/90',
  teal: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-teal-600)] [--checkbox-checked-border:var(--color-teal-700)]/90',
  cyan: '[--checkbox-check:var(--color-cyan-950)] [--checkbox-checked-bg:var(--color-cyan-300)] [--checkbox-checked-border:var(--color-cyan-400)]/80',
  sky: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-sky-500)] [--checkbox-checked-border:var(--color-sky-600)]/80',
  blue: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-blue-600)] [--checkbox-checked-border:var(--color-blue-700)]/90',
  indigo:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-indigo-500)] [--checkbox-checked-border:var(--color-indigo-600)]/90',
  violet:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-violet-500)] [--checkbox-checked-border:var(--color-violet-600)]/90',
  purple:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-purple-500)] [--checkbox-checked-border:var(--color-purple-600)]/90',
  fuchsia:
    '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-fuchsia-500)] [--checkbox-checked-border:var(--color-fuchsia-600)]/90',
  pink: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-pink-500)] [--checkbox-checked-border:var(--color-pink-600)]/90',
  rose: '[--checkbox-check:var(--color-white)] [--checkbox-checked-bg:var(--color-rose-500)] [--checkbox-checked-border:var(--color-rose-600)]/90',
};

type Color = keyof typeof colors;

export function Checkbox({
  color = 'white',
  className,
  ...props
}: {
  color?: Color;
  className?: string;
} & Omit<Headless.CheckboxProps, 'as' | 'className'>) {
  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={clsx(className, 'group inline-flex focus:outline-hidden')}
    >
      <span className={clsx([base, colors[color]])}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-4 stroke-(--checkbox-check) opacity-0 group-data-checked:opacity-100 sm:h-3.5 sm:w-3.5"
          viewBox="0 0 40 40"
          fill="none"
        >
          {/* Checkmark icon */}
          <path
            d="m14.6 33.11-8.31-10a2.88 2.88 0 0 1-.82-2 2.68 2.68 0 0 1 2.8-2.74 2.66 2.66 0 0 1 2.22 1.07l6.61 8.1L30.14 7a2.63 2.63 0 0 1 2.46-1.48 2.7 2.7 0 0 1 2.81 2.73 3.32 3.32 0 0 1-.62 1.86L19.79 33a3 3 0 0 1-2.63 1.34 3.15 3.15 0 0 1-2.56-1.23z"
            className="fill-(--checkbox-check) opacity-100 group-data-indeterminate:opacity-0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Headless.Checkbox>
  );
}
