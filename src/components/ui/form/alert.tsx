'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ActionResponse } from '@/lib/types';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function FormAlert({
  state,
  children,
}: {
  state?: ActionResponse;
  children?: React.ReactNode;
}) {
  // Don't show the alert if there's no message or errors
  if (state?.success || !state?.message) return null;

  return (
    <Alert>
      {state?.success ? (
        <CheckCircleIcon className="size-4" />
      ) : (
        <ExclamationTriangleIcon className="size-4" />
      )}
      <AlertTitle>{state?.success ? 'Success' : 'Error'}</AlertTitle>
      <AlertDescription>
        <h3>{state?.message}</h3>
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function AuthAlert({
  state,
  error,
}: {
  state?: ActionResponse;
  error?: string;
}) {
  const getAuthError = (error: string | undefined) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'An account with that email already exists. Please log in with your password or use a different email.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const message = state?.message || (error ? getAuthError(error) : null);

  // Don't show the alert if there's no message
  if (!message) return null;

  return (
    <Alert>
      {state?.success ? (
        <CheckCircleIcon className="size-4" />
      ) : (
        <ExclamationTriangleIcon className="size-4" />
      )}
      <AlertTitle>{state?.success ? 'Success' : 'Error'}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
