import * as Headless from '@headlessui/react';
import {
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type React from 'react';
import { Button, ButtonColor, ButtonLoading } from './button';
import { Text } from './text';

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

export function Dialog({
  size = 'lg',
  className,
  children,
  ...props
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & Omit<Headless.DialogProps, 'as' | 'className'>) {
  return (
    <Headless.Dialog {...props}>
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 transition duration-100 focus:outline-0 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/50"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
        <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
          <Headless.DialogPanel
            transition
            className={clsx(
              className,
              sizes[size],
              'row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-(--gutter) shadow-lg ring-1 ring-zinc-950/10 [--gutter:--spacing(8)] sm:mb-auto sm:rounded-2xl dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline',
              'transition duration-100 will-change-transform data-closed:translate-y-12 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in sm:data-closed:translate-y-0 sm:data-closed:data-enter:scale-95'
            )}
          >
            {children}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}

export function DialogTitle({
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

export function DialogDescription({
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

export function DialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'mt-6')} />;
}

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    />
  );
}

/***************************************************************
                     Dialog with Icon
***************************************************************/
type DialogVariant = 'error' | 'info' | 'success' | 'warning';

interface DialogWithIconProps
  extends Omit<React.ComponentProps<typeof Headless.Dialog>, 'onClose'> {
  variant?: DialogVariant;
  open: boolean;
  onClose: () => void;
  onAction: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  body?: React.ReactNode;
  actionText?: string;
  disabled?: boolean;
  pending?: boolean;
}

export function DialogWithIcon({
  variant = 'info',
  open,
  onClose,
  onAction,
  title,
  description,
  body,
  actionText,
  disabled = false,
  pending = false,
  ...props
}: DialogWithIconProps) {

  const styles: Record<DialogVariant, {
    buttonColor: ButtonColor;
    background: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
  }> = {
    error: {
      buttonColor: 'red',
      background: 'bg-red-100',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600',
    },
    info: {
      buttonColor: 'blue',
      background: 'bg-blue-100',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600',
    },
    success: {
      buttonColor: 'lime',
      background: 'bg-green-100',
      icon: CheckIcon,
      iconColor: 'text-green-600',
    },
    warning: {
      buttonColor: 'amber',
      background: 'bg-yellow-100',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600',
    },
  };

  const Icon = styles[variant].icon;
  const ActionButton = pending ? ButtonLoading : Button;

  return (
    <Headless.Dialog
      open={open}
      onClose={onClose}
      className="relative z-10"
      {...props}
    >
      <Headless.DialogBackdrop
        transition
        className={clsx(
          'fixed inset-0 transition-opacity data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-400 data-leave:ease-in',
          'bg-zinc-950/25 dark:bg-zinc-950/50'
        )}
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Headless.DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {/* Close Button */}
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <Button plain onClick={onClose} disabled={disabled}>
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6 stroke-2" />
              </Button>
            </div>
            {/* Dialog Body */}
            <div className="sm:flex sm:items-start">
              {/* Icon */}
              <div
                className={clsx(
                  'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10',
                  styles[variant].background
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={clsx('size-6', styles[variant].iconColor)}
                />
              </div>
              {/* Title and Description */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                {body && <DialogBody className="!mt-3">{body}</DialogBody>}
              </div>
            </div>
            {/* Dialog Actions */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
              <ActionButton
                type="button"
                className="inline-flex w-full justify-center sm:ml-3 sm:w-auto"
                color={styles[variant].buttonColor}
                onClick={onAction}
                disabled={disabled}
              >
                {actionText || 'Confirm'}
              </ActionButton>
              <Button
                plain
                type="button"
                className="mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto "
                onClick={onClose}
                disabled={disabled}
              >
                Cancel
              </Button>
            </div>
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}
