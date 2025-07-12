'use server'

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

import { signInSchema, signUpSchema } from '@/lib/zod';
import { SignInActionResponse, SignUpActionResponse } from "@/lib/types";
import { createUser } from "@/lib/data";

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

export async function signUpAction(_: SignUpActionResponse | null, formData: FormData): Promise<SignUpActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = signUpSchema.safeParse(data);
  console.log('data:', data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    console.log('Validation errors:', parsed.error.errors);
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data
    }
  }

  // Create a new user with the validated data
  const { name, email, password } = parsed.data;

  try {
    await createUser(name, email, password);
    await signIn('credentials', {
      email,
      password,
      redirectTo: data.redirectTo as string,
    });
    return {
      success: true,
      message: 'Successfully signed up.',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
}
