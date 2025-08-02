'use client';

import EmailSignUp from '@/components/auth/email-signup';
import OAuthSignIn from '@/components/auth/oauth-signin';
import { AuthAlert } from '@/components/ui/form/alert';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/hooks/toast';
import { signUpAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import { SignUpActionResponse } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const initialState: SignUpActionResponse = {
  success: false,
  message: '',
};

export default function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || routes.dashboard;
  const error = searchParams.get('error') || undefined;
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  useEffect(() => {
    if (state.success && state.user) {
      toast.success({
        message: 'Successfully signed up',
        description: `Welcome abroad, ${state.user.name}!`,
      });
      router.push(callbackUrl);
    }
  }, [state.success, state.user]);

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
