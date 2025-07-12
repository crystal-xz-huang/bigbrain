'use client';

import { Button } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { Heading, Subheading } from '@/components/ui/heading';
import { Strong, Text, TextLink } from '@/components/ui/text';

import { signInAction } from '@/lib/actions';
import { SignInActionResponse } from '@/lib/types';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

import { OAuthButton } from '@/components/auth/oauth-button';
import { providerMap } from '@/lib/auth.config';
import { signIn } from 'next-auth/react';

import { Input, InputPassword } from '@/components/ui/form';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Form from 'next/form'

const initialState: SignInActionResponse = {
  success: false,
  message: '',
};

function FormAlert({ state }: { state?: SignInActionResponse }) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || undefined;
  const AUTH_ERROR = 'There was a problem when trying to authenticate.';

  if (!error && !state?.message) return null
  return (
    <Alert>
      {state?.success ? <CheckCircleIcon className="h-4 w-4" /> : <ExclamationTriangleIcon className="h-4 w-4" />}
      <AlertTitle>{state?.success ? 'Success' : 'Error'}</AlertTitle>
      <AlertDescription>
        {state?.message || AUTH_ERROR}
      </AlertDescription>
    </Alert>
  );
}

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Log in to your account</Heading>

      {/* Error Message */}
      <FormAlert state={state} />

      {/* OAuth */}
      <div className="flex flex-col space-y-4">
        <Subheading className="font-medium!">
          Connect to BigBrain with:
        </Subheading>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(providerMap).map((provider) => (
            <OAuthButton
              key={provider.id}
              provider={provider}
              onClick={() => signIn(provider.id, { callbackUrl })}
              disabled={isPending}
              aria-disabled={isPending}
            />
          ))}
        </div>
      </div>

      {/* Email/Password Form */}
      <DividerText>Or log in with your Email</DividerText>
      <Form
        action={formAction}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        noValidate
      >
        <Field>
          <Label htmlFor='email'>Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby='email-error'
            defaultValue={state?.inputs?.email}
            invalid={!!state?.errors?.email}
            required
          />
          {state?.errors?.email && <ErrorMessage id='email-error'>{state.errors.email[0]}</ErrorMessage>}
        </Field>

        <Field>
          <Label htmlFor='password'>Password</Label>
          <InputPassword
            id="password"
            name="password"
            aria-describedby='password-error'
            autoComplete="current-password"
            invalid={!!state?.errors?.password}
            defaultValue={state?.inputs?.password}
            required
          />
          {state?.errors?.password && <ErrorMessage id='password-error'>{state.errors.password[0]}</ErrorMessage>}
        </Field>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log in'}
        </Button>
        <Text>
          Don’t have an account?{' '}
          <TextLink href="/register">
            <Strong>Sign up now</Strong>
          </TextLink>
        </Text>
      </Form>
    </div>
  );
}
