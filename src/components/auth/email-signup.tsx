'use client';

import { Button } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input, InputPassword } from '@/components/ui/form';
import { Strong, Text, TextLink } from '@/components/ui/text';
import { routes } from '@/lib/routes';
import { SignUpActionResponse } from '@/lib/types';
import Form from 'next/form';
interface EmailSignUpProps {
  state: SignUpActionResponse | undefined;
  action: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  // callbackUrl: string;
}

export default function EmailSignUp({
  state,
  action,
  pending,
}: EmailSignUpProps) {
  return (
    <>
      <DividerText>Or continue with Email</DividerText>
      <Form
        action={action}
        className="grid w-full max-w-sm grid-cols-1 gap-6"
        noValidate
      >
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            aria-describedby="name-error"
            defaultValue={state?.inputs?.name}
            invalid={!!state?.errors?.name}
            required
          />
          {state?.errors?.name && (
            <ErrorMessage id="email-error">{state.errors.name[0]}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="youremail@email.com"
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
            placeholder="Enter a unique password"
            autoComplete="new-password"
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

        <Field>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <InputPassword
            id="confirmPassword"
            name="confirmPassword"
            aria-describedby="confirmPassword-error"
            placeholder="Confirm your password"
            autoComplete="new-password"
            invalid={
              !!state?.errors?.confirmPassword &&
              state.errors.confirmPassword.length > 0
            }
            defaultValue={state?.inputs?.confirmPassword}
            required
          />
          {state?.errors?.confirmPassword && (
            <ErrorMessage id="confirmPassword-error">
              {state.errors.confirmPassword[0]}
            </ErrorMessage>
          )}
        </Field>

        {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}

        <Button
          type="submit"
          className="w-full"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? 'Signing up...' : 'Sign up'}
        </Button>

        <Text>
          Already have an account?{' '}
          <TextLink href={routes.signin}>
            <Strong>Log in</Strong>
          </TextLink>
        </Text>
      </Form>
    </>
  );
}
