'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input, PasswordInput } from '@/components/ui/form/input';
import { Strong, Text, TextLink } from '@/components/ui/text';
import type { SignInActionResponse } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import Form from 'next/form';

export default function EmailSignIn({
  state,
  action,
  pending
}: {
  state: SignInActionResponse | undefined;
  action: (formData: FormData) => void | Promise<void>;
  pending: boolean;
}) {
  const SubmitButton = pending ? ButtonLoading : Button;

  return (
    <>
      <DividerText>Or log in with your Email</DividerText>
      <Form
        action={action}
        className="grid w-full grid-cols-1 gap-8"
        noValidate
      >
        <Field>
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state?.inputs?.email}
            invalid={!!state?.errors?.email}
            required
          />
          {state?.errors?.email && (
            <ErrorMessage>{state.errors.email[0]}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Password</Label>
          <PasswordInput
            name="password"
            autoComplete="password"
            defaultValue={state?.inputs?.password}
            invalid={!!state?.errors?.password}
            required
          />
          {state?.errors?.password && (
            <ErrorMessage>{state.errors.password[0]}</ErrorMessage>
          )}
        </Field>

        <SubmitButton type="submit" className="w-full" disabled={pending}>
          {pending ? 'Logging in...' : 'Log In'}
        </SubmitButton>

        <Text>
          Don’t have an account?{' '}
          <TextLink href={routes.auth.signup}>
            <Strong>Sign up now</Strong>
          </TextLink>
        </Text>
      </Form>
    </>
  );
}
