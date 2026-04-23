'use client';

import { useRouter } from 'next/navigation';
import * as Headless from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type React from 'react';
import { Button } from './button';
import { Text } from './text';

type ModalVariant = 'error' | 'info' | 'success' | 'warning';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

export function Modal({
  size = 'lg',
  variant = 'info',
  children,
}: {
  size?: keyof typeof sizes;
  variant?: ModalVariant;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const onClose = () => router.back();

  return (
    <Headless.Dialog open onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 transition-opacity data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-400 data-leave:ease-in bg-zinc-950/25 dark:bg-zinc-950/70"
      />
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* The actual dialog panel  */}
          <Headless.DialogPanel
            transition
            className={clsx(
              sizes[size],
              'overflow-hidden px-4 pt-5 pb-4 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 rounded-lg bg-white text-left  shadow-xl ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline',
              'transition duration-100 will-change-transform data-closed:translate-y-12 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95'
            )}
          >
            {/* The close button */}
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <Button plain onClick={onClose}>
                <span className="sr-only">Close modal</span>
                <XMarkIcon aria-hidden="true" className="size-6 stroke-2" />
              </Button>
            </div>
            {/* The actual dialog content  */}
            <div className="sm:flex sm:items-start">
              {/* Icon */}
              <ModalIcon variant={variant} />
              {/* Content */}
              <div className="text-center sm:ml-4 sm:text-left flex-1">
                {children}
              </div>
            </div>
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}

export function ModalTitle({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DialogTitleProps,
  'as' | 'className'
>) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(
        className,
        'text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6 dark:text-white'
      )}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps<typeof Text>,
  'as' | 'className'
>) {
  return (
    <Headless.Description
      as={Text}
      {...props}
      className={clsx(className, 'mt-2 text-pretty')}
    />
  );
}

export function ModalBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'mt-3')} />;
}

export function ModalActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-5 flex flex-col-reverse items-center justify-end gap-3 **:w-full sm:flex-row sm:**:w-auto'
      )}
    />
  );
}

function ModalIcon({ variant }: { variant: ModalVariant }) {
  const styles = {
    error: {
      icon: ExclamationTriangleIcon,
      color: 'text-error',
      ring: 'text-error bg-error/20 border-error/5 ring-error',
    },
    info: {
      icon: InformationCircleIcon,
      color: 'text-info',
      ring: 'text-info bg-info/20 border-info/5 ring-info',
    },
    success: {
      icon: CheckCircleIcon,
      color: 'text-success',
      ring: 'text-success bg-success/20 border-success/5 ring-success',
    },
    warning: {
      icon: ExclamationCircleIcon,
      color: 'text-warning',
      ring: 'text-warning bg-warning/20 border-warning/5 ring-warning',
    },
  };
  const Icon = styles[variant].icon;

  return (
    <div
      className={clsx(
        'shrink-0 size-min flex items-center justify-center rounded-full p-1.5 border-6 mx-auto box-content bg-clip-padding sm:mt-1.5',
        styles[variant].ring
      )}
    >
      <Icon
        aria-hidden="true"
        className={clsx('m-auto size-6 !stroke-2', styles[variant].color)}
      />
    </div>
  );
}
