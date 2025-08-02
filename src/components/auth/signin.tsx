'use client';

import EmailSignIn from '@/components/auth/email-signin';
import OAuthSignIn from '@/components/auth/oauth-signin';
import { AuthAlert } from '@/components/ui/form/alert';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/hooks/toast';
import { signInAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import { SignInActionResponse } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const initialState: SignInActionResponse = {
  success: false,
  message: '',
};

export default function SignIn() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || routes.dashboard;
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.user) {
      toast.success({
        message: 'Successfully signed in',
        description: `Welcome back, ${state.user.name}!`,
      });
      router.push(callbackUrl);
    }
  }, [state.success, state.user]);

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Log in to your account</Heading>

      <AuthAlert state={state} error={error} />

      {/* OAuth Signin */}
      <OAuthSignIn pending={isPending} callbackUrl={callbackUrl} />

      {/* Email/Password Form */}
      <EmailSignIn
        state={state}
        action={formAction}
        pending={isPending}
      />
    </div>
  );
}
