'use server'

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from 'next-auth';
import { createUser, getUserByEmail, createGame, deleteGame} from "@/lib/data";
import { AuthResponse, SignInActionResponse, SignUpActionResponse, SignOutActionResponse, CreateGameActionResponse, DeleteGameActionResponse } from "@/lib/types";
import { signInSchema, signUpSchema, createGameSchema } from '@/lib/zod';
import { revalidatePath } from 'next/cache';
import { routes } from "./routes";
/***************************************************************
                     Auth
***************************************************************/
async function authenticate(email: string, password: string): Promise<AuthResponse> {
  // Attempt to sign in with the validated credentials
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    const user = await getUserByEmail(email);

    return {
      success: true,
      message: 'Successfully authenticated.',
      user,
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
  return await authenticate(email, password);
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
  return await authenticate(email, password);
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

/***************************************************************
                     Game
***************************************************************/
export async function createGameAction(_: CreateGameActionResponse | null, formData: FormData): Promise<CreateGameActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = createGameSchema.safeParse(data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data
    }
  }

  const session = await auth();
  const user = await getUserByEmail(session?.user?.email || '');
  if (!user) {
    return {
      success: false,
      message: 'You must be signed in to create a game.',
    };
  }

  // Create the game with the validated name
  const { name } = parsed.data;
  const game = await createGame(name, user);
  if (!game) {
    return {
      success: false,
      message: 'There was a problem creating the game. Please try again.',
    };
  }

  revalidatePath(routes.games);
  return {
    success: true,
    message: `Game created successfully!`,
    game,
  };
}

export async function deleteGameAction(gameId: string): Promise<DeleteGameActionResponse> {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email || '');
  if (!user) {
    return {
      success: false,
      message: 'You must be signed in to create a game.',
    };
  }
  // Delete the game by ID
  const success = await deleteGame(gameId, user);

  if (!success) {
    return {
      success: false,
      message: 'There was a problem deleting the game. Please try again.',
    };
  }

  revalidatePath(routes.games);
  return {
    success: true,
    message: 'Game deleted successfully.',
  };
}