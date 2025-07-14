'use client';

import { Toast as ToastComponent } from '@/components/ui/toast';
import type { ToastOptions, ToastType } from '@/lib/types';
import { ReactNode, useState } from 'react';
import Toast from './toast';
import ToastContext from './toast-context';

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    type: ToastType,
    message: string,
    description: string = '',
    options: ToastOptions = {}
  ) => {
    const newToast = new Toast(type, message, description, options);
    const idsToRemove = new Set<string>();

    // Remove duplicates
    const duplicates = toasts.filter((toast) => Toast.isEqual(toast, newToast));
    duplicates.forEach((t) => idsToRemove.add(t.id));

    // Remove toasts if there are more than 5
    if (toasts.length >= 5) idsToRemove.add(toasts[0].id);

    // Replace last toast if options.replace is true
    if (newToast.options.replace && toasts.length > 0)
      idsToRemove.add(toasts[toasts.length - 1].id);

    // Add new toast to the list
    setToasts((prev) => [
      ...prev.filter((t) => !idsToRemove.has(t.id)),
      newToast,
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed z-500 inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {toasts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((toast) => (
              <ToastComponent
                key={toast.id}
                type={toast.type}
                message={toast.message}
                description={toast.description}
                duration={toast.options.duration}
                onDismiss={() => removeToast(toast.id)}
              />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
