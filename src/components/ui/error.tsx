import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="flex h-8 items-end space-x-1"
      aria-live="polite"
      aria-atomic="true"
    >
      {message && (
        <>
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{message}</p>
        </>
      )}
    </div>
  );
}