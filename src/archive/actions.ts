/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import type {
  ActionResponse,
  UpdateGameActionResponse,
} from '@/lib/definitions/types';
import { InputError } from '@/lib/error';
import { getAvatarImages } from '@/lib/server';
import { parseFormData } from '@/lib/utils';
import {
  CreateGameSchema,
  PublishGameSchema,
  SaveGameSchema,
  sessionPinSchema,
  SignInSchema,
  SignUpSchema
} from '@/lib/zod/zod';
import { QuestionType } from '@prisma/client';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as z from 'zod';

/***************************************************************
                     Authentication
***************************************************************/

import { signIn, signOut } from '@/auth';
import { createUser } from '@/lib/data/auth';
import type {
  SignInActionResponse,
  SignOutActionResponse,
  SignUpActionResponse,
} from '@/lib/definitions/types';

const authenticate = async (email: string, password: string): Promise<void> => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
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
  const parsed = await parseFormData(formData, SignInSchema);
  if (!parsed.success) return {
    success: false,
    message: 'Please fix the errors in the form.',
    errors: parsed.errors,
    inputs: parsed.inputs,
  };

  try {
    const { email, password } = parsed.data;
    await authenticate(email, password);
    const user = await getUserFromEmailThrow(email);
   return {
      success: true,
      message: user.name ? `Welcome back, ${user.name}!` : 'Welcome back!',
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || 'There was a problem signing in. Please try again.',
      inputs: parsed.raw,
    };
  }
}

export async function signUpAction(
  _: SignUpActionResponse | null,
  formData: FormData
): Promise<SignUpActionResponse> {
  const parsed = await parseFormData(formData, SignUpSchema);
  if (!parsed.success) return parsed as SignUpActionResponse;

  try {
    const { name, email, password } = parsed.data;
    const user = await createUser(name, email, password);
    await authenticate(email, password);
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
      inputs: parsed.raw,
    };
  }
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
                      Game Mutation Actions
***************************************************************/

import { cloneGame, createGame, deleteGame, updateGame } from '@/lib/data/game';
import { UpdateGameTypes } from '@/lib/definitions/constants';
import type { CreateGameActionResponse, UpdateGameType } from '@/lib/definitions/types';

export async function createGameAction(
  _: CreateGameActionResponse | null,
  formData: FormData
): Promise<CreateGameActionResponse> {
  const parsed = await parseFormData(formData, CreateGameSchema);
  if (!parsed.success) return parsed as CreateGameActionResponse;

  const { name, redirectTo } = parsed.data;
  const gameId = await createGame(name);
  if (!gameId) {
    return {
      success: false,
      message: 'There was a problem creating the game. Please try again.',
      inputs: parsed.raw,
    };
  }

  return {
    success: true,
    message: `Game created successfully!`,
  };
}

export async function deleteGameAction(
  gameId: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const redirectTo = formData.get('redirectTo') as string;

  try {
    await deleteGame(gameId);
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'Failed to delete game. Please try again.',
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
  prevState: UpdateGameActionResponse | null,
  formData: FormData
): Promise<UpdateGameActionResponse> {
  const data = formData.get('game') as string;
  const updateType = formData.get('updateType') as UpdateGameType;
  const initialGame = await getGameEditDTO(gameId);

  console.log('Received game data:', data);
  console.log('Update type:', updateType);

  const defaultErrorMessage = `Failed to ${updateType.toLowerCase()} game. Please try again later.`;
  const isPublishing = updateType === UpdateGameTypes.PUBLISH;

  // (1) Check if game is passed as a JSON string
  if (typeof data !== 'string') {
    console.error(
      'Invalid payload. Expected a JSON string. Received:',
      typeof data
    );
    return {
      success: false,
      message: defaultErrorMessage,
      game: prevState?.game || initialGame,
    };
  }

  // (2) Parse the JSON string
  const parsed = isPublishing
    ? PublishGameSchema.safeParse(JSON.parse(data))
    : SaveGameSchema.safeParse(JSON.parse(data));

  console.log('Parsed game data:', parsed.data);

  if (!parsed.success) {
    console.log('Validation errors:', parsed.error);
    console.log('Treeified errors:', z.treeifyError(parsed.error));
    console.log('Pretty errors:', z.prettifyError(parsed.error));
    console.log('Flattened errors:', z.flattenError(parsed.error));

    const message = isPublishing
      ? 'This game is incomplete. Please fix errors before publishing.'
      : 'Failed to save game. Please fix errors before saving.';

    return {
      success: false,
      message: message,
      game: prevState?.game || initialGame,
    };
  }

  // (3) Update the game
  const updatedGame = await updateGame(updateType, parsed.data);
  if (!updatedGame) {
    return {
      success: false,
      message: defaultErrorMessage,
      game: prevState?.game || initialGame,
    };
  }

  if (updateType === UpdateGameTypes.PUBLISH) {
    // If publishing, redirect to the game view
    revalidatePath(`/${gameId}`);
    redirect(`/${gameId}`);
  } else {
    // If saving, return the updated game
    revalidatePath(`/${gameId}/edit`);
    return {
      success: true,
      message: 'Successfully saved game as draft.',
      game: updatedGame,
    };
  }
}

export async function cloneGameAction(
  gameId: string,
  _prevState: ActionResponse | null,
  _formData: FormData
): Promise<ActionResponse> {
  const clonedId = await cloneGame(gameId);
  if (!clonedId) {
    return {
      success: false,
      message: 'There was a problem cloning the game. Please try again.',
    };
  }
  revalidatePath(routes.game.view(clonedId));
  redirect(routes.game.view(clonedId));
}

/***************************************************************
                     Question Actions
***************************************************************/

import { createQuestion, deleteQuestion } from '@/lib/data/game';
import { getGameEditDTO } from '@/lib/data/game-dto';
import { getUserFromEmailThrow } from '@/lib/data/user-dto';
import type { CreateQuestionActionResponse } from '@/lib/definitions/types';

export async function createQuestionAction(
  gameId: string,
  _: CreateQuestionActionResponse | null,
  formData: FormData
): Promise<CreateQuestionActionResponse> {
  const type = formData.get('type') as QuestionType;
  const question = await createQuestion(gameId, type);
  if (!question) {
    return {
      success: false,
      message: 'There was a problem creating the question. Please try again.',
    };
  } else {
    return {
      success: true,
      message: 'Question created successfully.',
      question: question,
    };
  }
}

export async function deleteQuestionAction(
  questionId: string,
  _: ActionResponse | null,
  _formData: FormData
): Promise<ActionResponse> {
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

/***************************************************************
                     Session Functions
***************************************************************/

// Create a new session
export async function startGameAction(
  gameId: string,
  _prevState: StartGameActionResponse | null,
  _formData: FormData
): Promise<StartGameActionResponse> {
  try {
    const user = await getAuthUser();
    const session = await startGame(user.id, gameId);
    return {
      success: true,
      message: 'Game started successfully.',
      sessionId: session.id,
      pin: session.pin,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem starting the game.',
    };
  }
}

export async function lockSessionAction(
  sessionId: string,
  prevState: MutateSessionActionResponse | null,
  formData: FormData
): Promise<MutateSessionActionResponse> {
  try {
    const user = await getAuthUser();
    const locked = formData.get('locked') === 'true';
    const session = await lockSession({
      userId: user.id,
      sessionId,
      locked,
    });
    return {
      success: true,
      message: `Session ${locked ? 'locked' : 'unlocked'} successfully.`,
      session: session,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem locking the game.',
      session: prevState?.session || null,
    };
  }
}

// Mutate the session (start, advance, end)
export async function startSessionAction(
  sessionId: string,
  _prevState: MutateSessionActionResponse | null,
  _formData: FormData
): Promise<MutateSessionActionResponse> {
  try {
    const user = await getAuthUser();
    const session = await mutateSession({
      userId: user.id,
      sessionId,
      mutationType: MutationType.START,
    });
    return {
      success: true,
      message: 'started',
      session: session,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem starting the session.',
    };
  }
}

export async function advanceSessionAction(
  sessionId: string,
  _prevState: MutateSessionActionResponse | null,
  _formData: FormData
): Promise<MutateSessionActionResponse> {
  try {
    const user = await getAuthUser();
    const session = await mutateSession({
      userId: user.id,
      sessionId,
      mutationType: MutationType.ADVANCE,
    });
    return {
      success: true,
      message: 'advanced',
      session: session,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem advancing the session.',
    };
  }
}

export async function endSessionAction(
  sessionId: string,
  _prevState: MutateSessionActionResponse | null,
  _formData: FormData
): Promise<MutateSessionActionResponse> {
  try {
    const user = await getAuthUser();
    const session = await mutateSession({
      userId: user.id,
      sessionId,
      mutationType: MutationType.END,
    });
    return {
      success: true,
      message: 'ended',
      session: session,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem ending the session.',
    };
  }
}

/***************************************************************
                     Player Functions
***************************************************************/

export async function verifySessionPinAction(
  _prevState: VerifySessionPinActionResponse | null,
  formData: FormData
): Promise<VerifySessionPinActionResponse> {
  const parsed = await parseFormData(formData, sessionPinSchema);
  if (!parsed.success) return parsed as VerifySessionPinActionResponse;

  const { pin } = parsed.data;
  const valid = await verifySessionPin(pin);
  if (!valid) {
    return {
      success: false,
      message: 'Invalid session PIN',
      inputs: parsed.raw,
    };
  } else {
    revalidatePath(routes.player.play(pin));
    redirect(routes.player.play(pin));
  }
}

export async function createPlayerAction(
  pin: string,
  _prevState: CreatePlayerActionResponse | null,
  formData: FormData
): Promise<CreatePlayerActionResponse> {
  const parsed = await parseFormData(formData, playerSchema);
  if (!parsed.success) return parsed as CreatePlayerActionResponse;

  try {
    const { name, image } = parsed.data;
    console.log('Creating player with data:', parsed.data);

    // Check image
    const avatarFiles = getAvatarImages();
    if (!avatarFiles.includes(image)) {
      return {
        success: false,
        message: 'Invalid avatar image selected.',
        inputs: parsed.raw,
      };
    }

    const player = await playerJoin(pin, name, image);

    // Set the playerId cookie to persist the player session
    const cookieStore = await cookies();
    cookieStore.set('playerId', player.id, {
      path: routes.player.play(pin),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Revalidate the path
    revalidatePath(routes.player.play(pin));

    return {
      success: true,
      message: 'Player created successfully.',
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message || 'There was a problem creating the player.',
      inputs: parsed.raw,
    };
  }
}
