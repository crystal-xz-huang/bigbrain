'use server';

import { signIn, signOut } from '@/auth';
import { createUser, verifyUser } from '@/lib/data/auth';
import { getUserFromEmailThrow } from '@/lib/data/user-dto';
import type {
  SignInActionResponse,
  SignOutActionResponse,
  SignUpActionResponse,
  SignUpFormData,
  UserDTO
} from '@/lib/definitions/types';
import { InputError } from '@/lib/error';
import { parseFormData } from '@/lib/utils';
import { SignInSchema, SignUpSchema } from '@/lib/zod';
import { AuthError } from 'next-auth';
import * as z from 'zod';

/***************************************************************
                     Authentication
***************************************************************/

const authenticate = async (
  email: string,
  password: string
): Promise<UserDTO> => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    return await getUserFromEmailThrow(email);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': // Thrown when authorize() returns null
          throw new InputError('Invalid credentials. Please try again.');
        default:
          throw new Error('An unexpected error occurred during authentication');
      }
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
};

export async function signInAction(
  _: SignInActionResponse | null,
  formData: FormData
): Promise<SignInActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = await SignInSchema.safeParseAsync(data);
  if (!parsed.success)
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: z.flattenError(parsed.error).fieldErrors,
      inputs: data,
    };

  try {
    const { email, password } = parsed.data;
    const user = await authenticate(email, password);
    return {
      success: true,
      message: user.name ? `Welcome back, ${user.name}!` : 'Welcome back!',
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      inputs: data,
    };
  }
}

export async function signUpAction(
  _: SignUpActionResponse | null,
  formData: FormData
): Promise<SignUpActionResponse> {
  const parsed = parseFormData<SignUpFormData, typeof SignUpSchema>(
    formData,
    SignUpSchema
  );
  if (!parsed.success) return parsed as SignUpActionResponse;

  try {
    const { name, email, password } = parsed.data;
    await createUser(name, email, password);
    const user = await authenticate(email, password);
    return {
      success: true,
      message: user.name ? `Welcome aboard, ${user.name}!` : 'Welcome aboard!',
    };
  } catch (error) {
    return {
      success: false,
      message:
        (error as Error).message ||
        'There was a problem signing up. Please try again.',
      inputs: parsed.inputs,
    };
  }
}

export async function signOutAction(): Promise<SignOutActionResponse> {
  const user = await verifyUser();

  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: `See you next time, ${user.name || 'friend'}!`,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || 'There was a problem signing out.',
    };
  }
}
