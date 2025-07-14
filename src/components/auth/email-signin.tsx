'use client';

import { Button } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input, InputPassword } from '@/components/ui/form';
import { Strong, Text, TextLink } from '@/components/ui/text';
import { SignInActionResponse } from '@/lib/types';
import Form from 'next/form';

interface EmailSignInProps {
  state: SignInActionResponse | undefined;
  action: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  callbackUrl: string;
}

export default function EmailSignIn({
  state,
  action,
  pending,
  callbackUrl,
}: EmailSignInProps) {

  return (
    <>
      <DividerText>Or log in with your Email</DividerText>
      <Form
        action={action}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        noValidate
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-describedby="email-error"
            defaultValue={state?.inputs?.email}
            invalid={!!state?.errors?.email}
            required
          />
          {state?.errors?.email && (
            <ErrorMessage id="email-error">
              {state.errors.email[0]}
            </ErrorMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPassword
            id="password"
            name="password"
            aria-describedby="password-error"
            autoComplete="current-password"
            invalid={!!state?.errors?.password}
            defaultValue={state?.inputs?.password}
            required
          />
          {state?.errors?.password && (
            <ErrorMessage id="password-error">
              {state.errors.password[0]}
            </ErrorMessage>
          )}
        </Field>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button
          type="submit"
          className="w-full"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? 'Logging in...' : 'Log in'}
        </Button>

        <Text>
          Don’t have an account?{' '}
          <TextLink href="/register">
            <Strong>Sign up now</Strong>
          </TextLink>
        </Text>
      </Form>
    </>
  );
}
