'use server'

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

import { signInSchema } from '@/lib/zod';
import { SignInActionResponse } from "./types";

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
  try {
    await signIn('credentials', {
      ...parsed.data,
      redirectTo: data.redirectTo as string,
    });
    return {
      success: true,
      message: 'Successfully signed in.',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': // Thrown when authorize() returns null
          return {
            success: false,
            message: 'Invalid credentials. Check the details you provided are correct.',
          }
        default:
          return {
            success: false,
            message: 'Something went wrong. Please try again.',
          };
        }
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
}
