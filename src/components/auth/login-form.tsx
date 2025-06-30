import { Button } from '@/components/button';
import { Checkbox, CheckboxField } from '@/components/checkbox';
import { Field, Label } from '@/components/fieldset';
import { Heading } from '@/components/heading';
import { Input } from '@/components/input';
import { Strong, Text, TextLink } from '@/components/text';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { redirect } from "next/navigation"
import { signIn, providerMap } from "@/auth"
import { AuthError } from "next-auth"

const SIGNIN_ERROR_URL = "/error"

export default async function LoginForm({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl: string | undefined }>
}) {
  const { callbackUrl} = await searchParams;
  return (
    <>
      <form
        action={async (formData) => {
          'use server';
          try {
            await signIn("credentials", formData)
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
            }
            throw error
          }
        }}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Sign in to your account</Heading>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" />
        </Field>
        <div className="flex items-center justify-between">
          <CheckboxField>
            <Checkbox name="remember" />
            <Label>Remember me</Label>
          </CheckboxField>
          <Text>
            <TextLink href="#">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full" aria-disabled={isPending} disabled={isPending}>
          Login
        </Button>
        <Text>
          Don’t have an account?{' '}
          <TextLink href="#">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
      {/* OAuth sign-in buttons */}
      <Heading>Or sign in with</Heading>
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            'use server';
             try {
                await signIn(provider.id, { redirectTo: callbackUrl ?? '' });
             } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                throw error;
             }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </>
  );
}
