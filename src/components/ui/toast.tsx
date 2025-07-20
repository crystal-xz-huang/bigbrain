'use client';

import type { ToastType } from '@/lib/types';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const toastIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};

const toastStyles: Record<ToastType, { icon: string; btn: string }> = {
  success: {
    icon: 'text-green-400',
    btn: 'focus:ring-2 focus:ring-green-600 focus:ring-offset-green-50 focus:outline-hidden',
  },
  error: {
    icon: 'text-red-400',
    btn: 'focus:ring-2 focus:ring-red-600 focus:ring-offset-red-50 focus:outline-hidden',
  },
  info: {
    icon: 'text-blue-400',
    btn: 'focus:ring-2 focus:ring-blue-600 focus:ring-offset-blue-50 focus:outline-hidden',
  },
  warning: {
    icon: 'text-yellow-400',
    btn: 'focus:ring-2 focus:ring-yellow-600 focus:ring-offset-yellow-50 focus:outline-hidden',
  },
};

export function Toast({
  type,
  message,
  description,
  duration,
  onDismiss
}: {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
}) {
  const [show, setShow] = useState(true);
  const Icon = toastIcons[type];

  useEffect(() => {
    setTimeout(() => setShow(false), duration);
  }, [duration]);

  return (
    <>
      {/* ToastWrapper panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition show={show} afterLeave={onDismiss}>
        <div className={clsx(
          // Base styles
          'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition',
          // Shared closed styles
          'data-closed:opacity-0 data-closed:data-enter:translate-y-2 data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0',
          // Entering styles
          'data-enter:transform data-enter:duration-300 data-enter:ease-out',
          // Leaving styles
          'data-leave:duration-300 data-leave:ease-in'
        )}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <Icon
                  aria-hidden="true"
                  className={clsx('size-6', toastStyles[type].icon)}
                />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-900">{message}</p>
                {description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{description}</p>
                )}
              </div>
              <div className="ml-4 flex shrink-0">
                <button
                  type="button"
                  className={clsx(
                    'inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500',
                    toastStyles[type].btn
                  )}
                  onClick={() => setShow(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
