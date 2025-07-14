'use server'

import { signIn, signOut } from "@/auth";
import { AuthError } from 'next-auth';

import { createUser, getUserByEmail } from "@/lib/data";
import { AuthResponse, SignInActionResponse, SignUpActionResponse, SignOutActionResponse } from "@/lib/types";
import { signInSchema, signUpSchema } from '@/lib/zod';

async function authenticate(email: string, password: string, redirectTo: string): Promise<AuthResponse> {
  // Attempt to sign in with the validated credentials
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectTo,
    });
    return {
      success: true,
      message: `Successfully authenticated. Redirecting to ${redirectTo}`,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': // Thrown when authorize() returns null
          return {
            success: false,
            message: 'Invalid credentials. Check the details you provided are correct.',
          };
        default:
          return {
            success: false,
            message: 'There was a problem when trying to authenticate. Please try again.',
          };
        }
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
}

export async function signInAction(_: SignInActionResponse | null, formData: FormData): Promise<SignInActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = signInSchema.safeParse(data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data
    }
  }

  // Attempt to sign in with the validated credentials
  const { email, password } = parsed.data;
  return await authenticate(email, password, data.redirectTo as string);
}

export async function signUpAction(_: SignUpActionResponse | null, formData: FormData): Promise<SignUpActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = signUpSchema.safeParse(data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data
    }
  }

  // Check if user already exists
  const { name, email, password } = parsed.data;
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: 'An account with that email already exists. Please log in or use a different email.',
    };
  }

  await createUser(name, email, password);
  return await authenticate(email, password, data.redirectTo as string);
}

export async function signOutAction(): Promise<SignOutActionResponse> {
  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: 'Successfully signed out',
    }
  } catch (err) {
    console.error('Sign out error:', err);
    return {
      success: false,
      message: 'There was a problem signing out. Please try again.',
    };
  }
}