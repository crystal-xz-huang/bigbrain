'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input, InputPassword } from '@/components/ui/form';
import { Strong, Text, TextLink } from '@/components/ui/text';
import { routes } from '@/lib/routes';
import { SignInActionResponse } from '@/lib/types';
import Form from 'next/form';

interface EmailSignInProps {
  state: SignInActionResponse | undefined;
  action: (formData: FormData) => void | Promise<void>;
  pending: boolean;
}

export default function EmailSignIn({
  state,
  action,
  pending,
}: EmailSignInProps) {

  const SubmitButton = pending ? ButtonLoading : Button;

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
            invalid={!!state?.errors?.email && state?.errors?.email?.length > 0}
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
            invalid={
              !!state?.errors?.password && state.errors.password.length > 0
            }
            defaultValue={state?.inputs?.password}
            required
          />
          {state?.errors?.password && (
            <ErrorMessage id="password-error">
              {state.errors.password[0]}
            </ErrorMessage>
          )}
        </Field>

        <SubmitButton type="submit" className="w-full">
          {pending ? 'Logging in...' : 'Log In'}
        </SubmitButton>

        <Text>
          Don’t have an account?{' '}
          <TextLink href={routes.signup}>
            <Strong>Sign up now</Strong>
          </TextLink>
        </Text>
      </Form>
    </>
  );
}
