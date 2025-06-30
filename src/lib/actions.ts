'use server'

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined, // the return value from the previous action (aka the previous form submission)
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn('credentials', formData);
    console.log('Sign in successful');
  } catch (error) {
    console.log('Sign in failed', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': // Thrown when authorize() returns null
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.'; //  ← this becomes new `prevState`
      }
    }
    throw error;
  }
}
