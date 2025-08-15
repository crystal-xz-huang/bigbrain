import * as Headless from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Form from 'next/form';
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
  action?: (formData: FormData) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  body?: React.ReactNode;
  actionText?: string | React.ReactNode;
  disabled?: boolean;
  pending?: boolean;
  children?: React.ReactNode;
}

export function DialogWithIcon({
  variant = 'info',
  open,
  onClose,
  action,
  title,
  description,
  body,
  actionText,
  disabled = false,
  pending = false,
  children,
  ...props
}: DialogWithIconProps) {
  const styles: Record<
    DialogVariant,
    {
      buttonColor: ButtonColor;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      iconColor: string;
      ring: string;
    }
  > = {
    error: {
      buttonColor: 'error',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-error',
      ring: 'text-error bg-error/20 border-error/5 ring-error',
    },
    info: {
      buttonColor: 'info',
      icon: InformationCircleIcon,
      iconColor: 'text-info',
      ring: 'text-info bg-info/20 border-info/5 ring-info',
    },
    success: {
      buttonColor: 'success',
      icon: CheckCircleIcon,
      iconColor: 'text-success',
      ring: 'text-success bg-success/20 border-success/5 ring-success',
    },
    warning: {
      buttonColor: 'warning',
      icon: ExclamationCircleIcon,
      iconColor: 'text-warning',
      ring: 'text-warning bg-warning/20 border-warning/5 ring-warning',
    },
  };

  const Icon = styles[variant].icon;
  const SubmitButton = pending ? ButtonLoading : Button;

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
          'bg-zinc-950/25 dark:bg-zinc-950/70'
        )}
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Headless.DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#353535] px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {/* Close Button */}
            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <Button plain onClick={onClose} disabled={disabled || pending}>
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6 stroke-2" />
              </Button>
            </div>
            {/* Dialog Body */}
            <div className="sm:flex sm:items-start">
              {/* Icon */}
              <div className={clsx(
                "shrink-0 size-min flex items-center justify-center rounded-full p-1.5 border-6 mx-auto box-content bg-clip-padding",
                styles[variant].ring,
              )}>
                <Icon
                  aria-hidden="true"
                  className={clsx('m-auto size-6 !stroke-2', styles[variant].iconColor)}
                />
              </div>

              {/* <div
                className={clsx(
                  'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 border-6 ring-1',
                  styles[variant].ring
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={clsx('m-auto size-5', styles[variant].iconColor)}
                />
              </div> */}
              {/* Title and Description */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                {body && <DialogBody className="!mt-3">{body}</DialogBody>}
              </div>
            </div>
            {/* Dialog Actions */}
            {action ? (
              <Form
                action={action}
                className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2"
              >
                {children}
                <SubmitButton
                  type="submit"
                  className="inline-flex w-full justify-center sm:ml-3 sm:w-auto"
                  color={styles[variant].buttonColor}
                  disabled={pending}
                >
                  {actionText || 'Confirm'}
                </SubmitButton>
                <Button
                  plain
                  type="button"
                  className="mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto "
                  onClick={onClose}
                  disabled={pending}
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                {children}
              </div>
            )}
          </Headless.DialogPanel>
        </div>
      </div>
    </Headless.Dialog>
  );
}
