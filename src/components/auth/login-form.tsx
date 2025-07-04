'use client';

import { Button } from '@/components/button';
import { Field, Label } from '@/components/fieldset';
import { Input } from '@/components/input';
import { Strong, Text, TextLink } from '@/components/text';
import { DividerText } from '@/components/divider';
import { Heading, Subheading } from '@/components/heading';
import { ErrorMessage } from '@/components/error';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

// oauth providers
import { providerMap } from '@/lib/auth.config';
import { OAuthButton } from '@/components/auth/oauth-button';
import { signIn } from 'next-auth/react';

// validation
import { useState } from 'react';
import { signInSchema } from '@/lib/zod';

const AUTH_ERROR = 'There was a problem when trying to authenticate. Please try again.';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error') || undefined;
  const formData = useState({ email: '', password: '' });
  const [loginError, loginAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  const errorMessage = loginError || (error && AUTH_ERROR) || undefined;

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <Heading>Log in to your account</Heading>

      {errorMessage && <ErrorMessage message={errorMessage} />}

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
      <form
        action={loginAction}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" id="password" />
        </Field>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-disabled={isPending}
        >
          Log in
        </Button>
        <Text>
          Don’t have an account?{' '}
          <TextLink href="#">
            <Strong>Sign up now</Strong>
          </TextLink>
        </Text>
      </form>
    </div>
  );
}
