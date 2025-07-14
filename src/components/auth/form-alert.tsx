'use client';

import { SignInActionResponse, SignUpActionResponse } from '@/lib/types';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const getAuthError = (error: string | undefined) => {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'An account with that email already exists. Please log in with your password or use a different email.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function FormAlert({
  state,
  error,
}: {
  state?: SignInActionResponse | SignUpActionResponse;
  error?: string;
}) {
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
