'use client';

import PasswordRequirementsPopup from '@/components/auth/signup/password-reqs';
import { Button, ButtonLoading } from '@/components/ui/button';
import { DividerText } from '@/components/ui/divider';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input, PasswordInput } from '@/components/ui/form/input';
import { Strong, Text, TextLink } from '@/components/ui/text';
import type {
  SignUpActionResponse,
  SignUpFieldErrors,
  SignUpFormData,
} from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { SignUpSchema } from '@/lib/zod';
import Form from 'next/form';
import { useState } from 'react';
import * as z from 'zod';

const initialData: SignUpFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function EmailSignUp({
  state,
  action,
  pending,
}: {
  state: SignUpActionResponse | undefined;
  action: (formData: FormData) => void | Promise<void>;
  pending: boolean;
}) {
  const [data, setData] = useState<SignUpFormData>(initialData);
  const [errors, setErrors] = useState<SignUpFieldErrors>({});
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const SubmitButton = pending ? ButtonLoading : Button;
  const hasErrors = Object.values(errors).some(
    (error) => error && error.length > 0
  );

  const isInvalid = (field: keyof SignUpFormData) =>  {
    return !!(errors[field] || state?.errors?.[field]);
  }

  const getErrorMessage = (field: keyof SignUpFormData) => {
    if (errors[field]) return errors[field]?.[0];
    if (state?.errors?.[field]) return state.errors[field]?.[0];
    return null;
  };

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    const parsed = SignUpSchema.safeParse(data);
    if (parsed.success) {
      setErrors({});
      return;
    }
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    if (field in fieldErrors) {
      setErrors({ ...errors, [field]: fieldErrors[field] });
    } else {
      // delete the key if no error
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  };

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
            invalid={isInvalid('name')}
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {isInvalid('name') && (
            <ErrorMessage id="name-error">
              {getErrorMessage('name')}
            </ErrorMessage>
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
            invalid={isInvalid('email')}
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {isInvalid('email') && (
            <ErrorMessage id="email-error">
              {getErrorMessage('email')}
            </ErrorMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter a unique password"
            autoComplete="password"
            invalid={isInvalid('password')}
            value={data.password}
            onChange={(e) => {
              handleChange('password', e.target.value);
              setShowPasswordReqs(true);
            }}
            onFocus={() => setShowPasswordReqs(true)}
            onBlur={() => setShowPasswordReqs(false)}
            aria-describedby="password-error"
          >
            {/* Popover Content */}
            <PasswordRequirementsPopup show={showPasswordReqs} password={data.password} />
          </PasswordInput>
          {isInvalid('password') && (
            <ErrorMessage id="password-error">
              {getErrorMessage('password')}
            </ErrorMessage>
          )}
        </Field>

        <Field>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            aria-describedby="confirmPassword-error"
            placeholder="Confirm your password"
            autoComplete="password"
            invalid={isInvalid('confirmPassword')}
            value={data.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          {isInvalid('confirmPassword') && (
            <ErrorMessage id="confirmPassword-error">
              {getErrorMessage('confirmPassword')}
            </ErrorMessage>
          )}
        </Field>

        <SubmitButton
          type="submit"
          className="w-full"
          disabled={pending || hasErrors}
        >
          {pending ? 'Signing up...' : 'Sign up'}
        </SubmitButton>

        <Text>
          Already have an account?{' '}
          <TextLink href={routes.auth.signin}>
            <Strong>Log in</Strong>
          </TextLink>
        </Text>
      </Form>
    </>
  );
}
