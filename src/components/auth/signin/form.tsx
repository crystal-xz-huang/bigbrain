'use client';

import { AuthAlert } from '@/components/ui/form/alert';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/hooks/toast';
import { signInAction } from '@/lib/actions/auth';
import { SignInActionResponse } from '@/lib/definitions/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import EmailSignIn from '@/components/auth/signin/email-signin';
import OAuthSignIn from '@/components/auth/signin/oauth-signin';

const initialState: SignInActionResponse = {
  success: false,
  message: '',
};

export default function SignInForm() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      router.push(callbackUrl);
      toast.success({
        message: 'Successfully signed in',
        description: state.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <div className='grid w-full max-w-sm grid-cols-1 gap-8'>
      <Heading>Log in to your account</Heading>

      <AuthAlert state={state} error={error} />

      {/* OAuth Signin */}
      <OAuthSignIn pending={isPending} callbackUrl={callbackUrl} />

      {/* Email/Password Form */}
      <EmailSignIn state={state} action={formAction} pending={isPending} />
    </div>
  );
}
