'use server'

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { signInSchema } from '@/lib/zod';

export async function authenticate(
  prevState: string | undefined, // the return value from the previous action (aka the previous form submission)
  formData: FormData,
): Promise<string | undefined> {
  // Validate the form data using the signInSchema
  const validatedFields = signInSchema.safeParse(Object.fromEntries(formData));

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for signIn
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard';

  try {
    await signIn('credentials', formData);
    redirect(callbackUrl);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': // Thrown when authorize() returns null
          return 'Invalid email or password.';
        default:
          return 'Something went wrong.'; //  ← this becomes new `prevState`
      }
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
}
