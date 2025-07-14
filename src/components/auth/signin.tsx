'use client';

import EmailSignIn from '@/components/auth/email-signin';
import FormAlert from '@/components/auth/form-alert';
import OAuthSignIn from '@/components/auth/oauth-signin';
import { Heading } from '@/components/ui/heading';

import { signInAction } from '@/lib/actions';
import { SignInActionResponse } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

const initialState: SignInActionResponse = {
  success: false,
  message: '',
};

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Log in to your account</Heading>

      <FormAlert state={state} error={error} />

      {/* OAuth Signin */}
      <OAuthSignIn pending={isPending} callbackUrl={callbackUrl} />

      {/* Email/Password Form */}
      <EmailSignIn
        state={state}
        action={formAction}
        pending={isPending}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}
