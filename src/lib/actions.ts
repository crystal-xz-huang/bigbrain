'use server';

import { signIn, signOut } from '@/auth';
import {
  cloneGame,
  createGame,
  createQuestion,
  createUser,
  deleteGame,
  deleteQuestion,
  fetchQuestionsByGameId,
  fetchUserByEmail,
  updateGame,
} from '@/lib/data';
import { getAuthUser } from '@/lib/service';
import {
  ActionResponse,
  AuthResponse,
  CreateGameActionResponse,
  CreateQuestionActionResponse,
  DeleteGameActionResponse,
  DeleteQuestionActionResponse,
  SignInActionResponse,
  SignOutActionResponse,
  SignUpActionResponse,
  UpdateGameActionResponse,
} from '@/lib/types';
import {
  createGameSchema,
  groupQuestionErrors,
  signInSchema,
  updateGameSchema,
} from '@/lib/zod';
import { QuestionType } from '@prisma/client';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { routes } from './routes';

/***************************************************************
                     Helper Functions
***************************************************************/

const parseFormData = async (formData: FormData, schema: z.ZodSchema) => {
  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }
  return {
    success: true,
    data: parsed.data,
    raw: data,
  };
};

/***************************************************************
                     Auth Functions
***************************************************************/

async function authenticate(
  email: string,
  password: string
): Promise<AuthResponse> {
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

export async function signInAction(
  _: SignInActionResponse | null,
  formData: FormData
): Promise<SignInActionResponse> {
  const parsed = await parseFormData(formData, signInSchema);
  if (!parsed.success) return parsed as SignInActionResponse;
  const { email, password } = parsed.data;
  return await authenticate(email, password);
}

export async function signUpAction(
  _: SignUpActionResponse | null,
  formData: FormData
): Promise<SignUpActionResponse> {
  const parsed = await parseFormData(formData, signInSchema);
  if (!parsed.success) return parsed as SignUpActionResponse;

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
    return {
      success: false,
      message: (err as Error).message || 'There was a problem signing out.',
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
  const parsed = await parseFormData(formData, createGameSchema);
  if (!parsed.success) return parsed as CreateGameActionResponse;

  try {
    const { name } = parsed.data;
    const user = await getAuthUser();
    await createGame(user.id, name);
    return {
      success: true,
      message: `Game created successfully!`,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem creating the game.',
      inputs: parsed.raw,
    };
  }
}

export async function deleteGameAction(
  gameId: string,
  _prevState: CreateGameActionResponse | null,
  formData: FormData
): Promise<DeleteGameActionResponse> {
  const redirectTo = formData.get('redirectTo') as string;

  try {
    const user = await getAuthUser();
    await deleteGame(user.id, gameId);
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem deleting the game. Please try again.',
    };
  }

  if (redirectTo) {
    revalidatePath(redirectTo);
    redirect(redirectTo);
  }

  return {
    success: true,
    message: 'Game deleted successfully.',
  };
}

export async function updateGameAction(
  gameId: string,
  _: UpdateGameActionResponse | null,
  formData: FormData
): Promise<UpdateGameActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = updateGameSchema.safeParse({
    ...data,
    questions: JSON.parse(data.questions as string),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'This game is incomplete. Please fix the errors in the form.',
      errors: {
        ...fieldErrors,
        questions: groupQuestionErrors(parsed.error),
      },
    };
  }

  const user = await getAuthUser();
  const game = await updateGame(user.id, gameId, parsed.data);
  const redirectTo = formData.get('redirectTo') as string;

  if (!game) {
    return {
      success: false,
      message: 'There was a problem updating the game.',
    };
  }

  if (redirectTo) {
    revalidatePath(redirectTo);
    redirect(redirectTo);
  }

  return {
    success: true,
    message: 'Game updated successfully.',
    game: game,
  };
}

export async function cloneGameAction(
  gameId: string,
  _prevState: ActionResponse | null,
  _formData: FormData
): Promise<ActionResponse> {
  const game = await cloneGame(gameId);
  if (!game) {
    return {
      success: false,
      message: 'There was a problem cloning the game. Please try again.',
    };
  }
  revalidatePath(routes.game.edit(game.id));
  redirect(routes.game.edit(game.id));
}

export async function createQuestionAction(
  gameId: string,
  _: CreateQuestionActionResponse | null,
  formData: FormData
): Promise<CreateQuestionActionResponse> {
  const type = formData.get('type') as QuestionType;

  try {
    const user = await getAuthUser();
    const question = await createQuestion(user.id, gameId, type);
    const updatedQuestions = await fetchQuestionsByGameId(gameId);
    return {
      success: true,
      message: 'Question created successfully.',
      questions: updatedQuestions,
      question: question,
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
    const user = await getAuthUser();
    await deleteQuestion(user.id, questionId);
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
