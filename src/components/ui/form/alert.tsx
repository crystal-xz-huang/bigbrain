'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  SignInActionResponse,
  SignUpActionResponse,
} from '@/lib/definitions/types';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function FormAlert({
  variant,
  title,
  children,
}: {
  variant: 'success' | 'error';
  title: string | React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Alert>
      {variant === 'success' ? (
        <CheckCircleIcon className="size-4" />
      ) : (
        <ExclamationTriangleIcon className="size-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export function AuthAlert({
  state,
  error,
}: {
  state?: SignInActionResponse | SignUpActionResponse;
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
  // Don't show the alert if there's no message or errors
  if (state?.success || !message) return null;

  return (
    <Alert>
      <ExclamationTriangleIcon className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
