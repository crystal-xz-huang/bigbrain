import { providerMap, signIn } from '@/auth';

import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/button';
import { Field, Label } from '@/components/fieldset';
import { Heading, Subheading } from '@/components/heading';
import { Input } from '@/components/input';
import { Strong, Text, TextLink } from '@/components/text';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { Metadata } from 'next';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

function Divider() {
  return (
    <div className="flex items-center">
      <hr className="inline-block grow-4 border-zinc-950 dark:border-[#dedede]" />
      <span className="flex grow-1 justify-center text-center uppercase text-xs font-medium">
        Or log in with your Email
      </span>
      <hr className="inline-block grow-4 border-zinc-950 dark:border-[#dedede]" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm">
      <ExclamationCircleIcon className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}

const SIGNIN_ERROR_URL = "/signin";

const errorMap: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password.',
  OAuthSignin: 'OAuth sign-in failed.',
  OAuthCallback: 'OAuth callback failed.',
  default: 'Something went wrong. Please try again.',
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl: string | undefined;
    error: string | undefined;
  }>;
}) {
  const { callbackUrl = '/dashboard', error } = await searchParams;
  const errorMessage = error ? errorMap[error] || errorMap.default : undefined;

  return (
    <AuthLayout>
      <Suspense>
        <div className="grid w-full max-w-sm grid-cols-1 gap-8">
          <Heading>Log in to your account</Heading>

          {errorMessage && <ErrorMessage message={errorMessage} />}

          {/* OAuth */}
          <Subheading className="font-medium!">
            Connect to BigBrain with:
          </Subheading>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  'use server';
                  try {
                    await signIn(provider.id, { redirectTo: callbackUrl ?? '' });
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
              >
                <Button
                  type="submit"
                  color="dark/white"
                  className="w-full flex items-center justify-center gap-3"
                >
                  {provider.name}
                </Button>
              </form>
            ))}
          </div>

          {/* Email Login Form */}
          <Divider />
          <form
            action={async (formData: FormData) => {
              'use server';
              try {
                await signIn('credentials', formData);
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                }
                throw error;
              }
            }}
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
            <Button
              type="submit"
              className="w-full"
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
      </Suspense>
    </AuthLayout>
  );
}
