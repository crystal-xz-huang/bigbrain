'use server';

import { auth, signIn, signOut } from '@/auth';
import {
  createGame,
  createQuestion,
  createUser,
  deleteGame,
  deleteQuestion,
  fetchQuestionsByGameId,
  fetchUserByEmail,
  updateGame
} from '@/lib/data';
import { AccessError } from '@/lib/error';
import {
  AuthResponse,
  AuthUser,
  CreateGameActionResponse,
  CreateQuestionActionResponse,
  DeleteGameActionResponse,
  DeleteQuestionActionResponse,
  SignInActionResponse,
  SignOutActionResponse,
  SignUpActionResponse,
  UpdateGameActionResponse
} from '@/lib/types';
import {
  createGameSchema,
  groupQuestionErrors,
  signInSchema,
  signUpSchema,
  updateGameSchema
} from '@/lib/zod';
import { QuestionType } from '@prisma/client';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { routes } from './routes';

/***************************************************************
                     Helper Functions
***************************************************************/
async function fetchCurrentUser(): Promise<AuthUser> {
  const session = await auth();
  const user = await fetchUserByEmail(session?.user?.email || '');
  if (!user) throw new AccessError('Unauthorized access');
  return user;
}

async function authenticate(
  email: string,
  password: string
): Promise<AuthResponse> {
  // Attempt to sign in with the validated credentials
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    const user = await fetchUserByEmail(email);

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
            message:
              'Invalid credentials. Check the details you provided are correct.',
          };
        default:
          return {
            success: false,
            message:
              'There was a problem when trying to authenticate. Please try again.',
          };
      }
    }
    // If the error is not an AuthError, rethrow it and let Next.js handle it
    throw error;
  }
}

/***************************************************************
                     Auth Functions
***************************************************************/

export async function signInAction(
  _: SignInActionResponse | null,
  formData: FormData
): Promise<SignInActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = signInSchema.safeParse(data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  // Attempt to sign in with the validated credentials
  const { email, password } = parsed.data;
  return await authenticate(email, password);
}

export async function signUpAction(
  _: SignUpActionResponse | null,
  formData: FormData
): Promise<SignUpActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = signUpSchema.safeParse(data);

  // If form validation fails, return errors early. Otherwise, continue.
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  // Check if user already exists
  const { name, email, password } = parsed.data;
  const existingUser = await fetchUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message:
        'An account with that email already exists. Please log in or use a different email.',
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
    };
  } catch (err) {
    console.error('Sign out error:', err);
    return {
      success: false,
      message: 'There was a problem signing out. Please try again.',
    };
  }
}

/***************************************************************
                     Game Functions
***************************************************************/

export async function createGameAction(
  _: CreateGameActionResponse | null,
  formData: FormData
): Promise<CreateGameActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = createGameSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  try {
    const { name } = parsed.data;
    const user = await fetchCurrentUser();
    await createGame(name, user.id);
    revalidatePath(routes.games);
    return {
      success: true,
      message: `Game created successfully!`,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem creating the game. Please try again.',
      inputs: data,
    };
  }
}

export async function deleteGameAction(
  gameId: string,
  _: CreateGameActionResponse | null,
  _formData: FormData
): Promise<DeleteGameActionResponse> {
  try {
    const user = await fetchCurrentUser();
    await deleteGame(gameId, user.id);
    revalidatePath(routes.games);
    return {
      success: true,
      message: 'Game deleted successfully.',
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem deleting the game. Please try again.',
    };
  }
}

export async function updateGameAction(
  gameId: string,
  _: UpdateGameActionResponse | null,
  formData: FormData
): Promise<UpdateGameActionResponse> {
  console.log('Updating game with ID:', gameId);
  const data = Object.fromEntries(formData);
  console.log('Form data:', data);
  const parsed = updateGameSchema.safeParse({
    ...data,
    questions: JSON.parse(data.questions as string),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: {
        ...fieldErrors,
        questions: groupQuestionErrors(parsed.error),
      },
    };
  }

  try {
    const user = await fetchCurrentUser();
    const game = await updateGame(gameId, user.id, parsed.data);
    return {
      success: true,
      message: 'Game updated successfully.',
      game: game,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem updating the game. Please try again.',
    };
  }
}

/***************************************************************
                     Question Functions
***************************************************************/

export async function createQuestionAction(
  gameId: string,
  _: CreateQuestionActionResponse | null,
  formData: FormData
): Promise<CreateQuestionActionResponse> {
  const type = formData.get('type') as QuestionType;
  try {
    const user = await fetchCurrentUser();
    await createQuestion(gameId, type, user.id);
    // Fetch the updated questions
    const updatedQuestions = await fetchQuestionsByGameId(gameId);
    return {
      success: true,
      message: 'Question created successfully.',
      questions: updatedQuestions,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem creating the question. Please try again.',
    };
  }
}

export async function deleteQuestionAction(
  questionId: string,
  _: DeleteQuestionActionResponse | null,
  _formData: FormData
): Promise<DeleteQuestionActionResponse> {
  try {
    const user = await fetchCurrentUser();
    await deleteQuestion(questionId, user.id);
    return {
      success: true,
      message: 'Question deleted successfully.',
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem deleting the question. Please try again.',
    };
  }
}
