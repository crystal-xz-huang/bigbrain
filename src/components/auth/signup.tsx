'use client';

import EmailSignUp from '@/components/auth/email-signup';
import FormAlert from '@/components/auth/form-alert';
import OAuthSignIn from '@/components/auth/oauth-signin';
import { Heading } from '@/components/ui/heading';

import { signUpAction } from '@/lib/actions';
import { SignUpActionResponse } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

const initialState: SignUpActionResponse = {
  success: false,
  message: '',
};

export default function SignUp() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Create your account</Heading>

      <FormAlert state={state} error={error} />

      {/* OAuth */}
      <OAuthSignIn pending={isPending} callbackUrl={callbackUrl} />

      {/* Email/Password Form */}
      <EmailSignUp
        state={state}
        action={formAction}
        pending={isPending}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}
