'use client';

import { AuthAlert } from '@/components/ui/form/alert';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/hooks/toast';
import { signUpAction } from '@/lib/actions/auth';
import { SignUpActionResponse } from '@/lib/definitions/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';

import EmailSignUp from '@/components/auth/signup/email-signup';
import OAuthSignIn from '@/components/auth/signin/oauth-signin';

const initialState: SignUpActionResponse = {
  success: false,
  message: '',
};

export default function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      router.push(callbackUrl);
      toast.success(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Create your account</Heading>

      <AuthAlert state={state} error={error} />

      {/* OAuth */}
      <OAuthSignIn pending={isPending} callbackUrl={callbackUrl} />

      {/* Email/Password Form */}
      <EmailSignUp state={state} action={formAction} pending={isPending} />
    </div>
  );
}
