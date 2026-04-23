/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import {
  cloneGame,
  cloneQuestion,
  createGame,
  createQuestion,
  deleteGame,
  deleteQuestion,
  updateGame,
} from '@/lib/data/game';
import { UpdateGameTypeEnum } from '@/lib/definitions/constants';
import type {
  ActionResponse,
  CloneQuestionActionResponse,
  CreateGameActionResponse,
  CreateGameFormData,
  CreateQuestionActionResponse,
  CreateQuestionFormData,
  UpdateGameActionResponse,
  UpdateGameType,
} from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { formatZodIssues, parseFormData } from '@/lib/utils';
import {
  CreateGameSchema,
  CreateQuestionSchema,
  PublishGameSchema,
  SaveGameSchema,
} from '@/lib/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';

export async function createGameAction(
  _: CreateGameActionResponse | null,
  formData: FormData
): Promise<CreateGameActionResponse> {
  const parsed = parseFormData<CreateGameFormData, typeof CreateGameSchema>(
    formData,
    CreateGameSchema
  );
  if (!parsed.success) return parsed as CreateGameActionResponse;

  try {
    const { name } = parsed.data;
    const gameId = await createGame(name);
    return {
      success: true,
      message: 'Game created!',
      gameId: gameId,
    };
  } catch (e) {
    return {
      success: false,
      message:
        (e as Error).message || 'Failed to create game. Please try again.',
      inputs: parsed.inputs,
    };
  }
}

export async function deleteGameAction(
  gameId: string,
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = await deleteGame(gameId);
    return {
      success: true,
      message: `Successfully deleted ${name}`,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message,
    };
  }
}

export async function updateGameAction(
  userId: string,
  prevState: UpdateGameActionResponse | null,
  formData: FormData
): Promise<UpdateGameActionResponse> {
  const data = formData.get('game') as string;
  const updateType = formData.get('updateType') as UpdateGameType;
  const defaultErrorMessage = `Failed to ${updateType.toLowerCase()} game. Please try again later.`;
  const isPublishing = updateType === UpdateGameTypeEnum.PUBLISH;

  // (1) Check if game is passed as a JSON string
  if (typeof data !== 'string') {
    console.error(
      'Invalid payload. Expected a JSON string. Received:',
      typeof data
    );
    return {
      success: false,
      message: defaultErrorMessage,
    };
  }

  // (2) Parse the JSON string
  const parsed = isPublishing
    ? PublishGameSchema.safeParse(JSON.parse(data))
    : SaveGameSchema.safeParse(JSON.parse(data));

  if (!parsed.success) {
    console.error('Pretty errors:', z.prettifyError(parsed.error));
    console.error('Error issues:', parsed.error.issues);
    const message = isPublishing
      ? 'This game is incomplete. Please fix errors before publishing.'
      : 'Failed to save game. Please fix errors before saving.';

    return {
      success: false,
      message: message,
      errors: formatZodIssues(parsed.error.issues),
    };
  }

  // (3) Update the game
  const updatedGame = await updateGame(updateType, parsed.data, userId);
  if (!updatedGame) {
    return {
      success: false,
      message: defaultErrorMessage,
    };
  }

  if (updateType === UpdateGameTypeEnum.PUBLISH) {
    // If publishing, redirect to the game view
    revalidatePath(routes.game.view(parsed.data.id));
    redirect(routes.game.view(parsed.data.id));
  } else {
    // If saving, stay on the current page (edit page)
    revalidatePath(routes.game.edit(parsed.data.id));
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
                     Questions
***************************************************************/

export async function createQuestionAction(
  gameId: string,
  _: CreateQuestionActionResponse | null,
  formData: FormData
): Promise<CreateQuestionActionResponse> {
  const parsed = parseFormData<
    CreateQuestionFormData,
    typeof CreateQuestionSchema
  >(formData, CreateQuestionSchema);
  if (!parsed.success) return parsed as CreateQuestionActionResponse;

  const { type } = parsed.data;
  const question = await createQuestion(gameId, type);
  if (!question) {
    return {
      success: false,
      message: 'There was a problem creating the question. Please try again.',
    };
  }

  return {
    success: true,
    message: 'Question created successfully.',
    question: question,
  };
}

export async function deleteQuestionAction(
  questionId: string,
  _: ActionResponse | null,
  _formData: FormData
): Promise<ActionResponse> {
  try {
    await deleteQuestion(questionId);
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

export async function cloneQuestionAction(
  questionId: string,
  _: CloneQuestionActionResponse | null,
  formData: FormData
): Promise<CloneQuestionActionResponse> {
  try {
    const question = await cloneQuestion(questionId);
    return {
      success: true,
      message: 'Question cloned successfully.',
      question: question,
    };
  } catch (err) {
    return {
      success: false,
      message:
        (err as Error).message ||
        'There was a problem cloning the question. Please try again.',
    };
  }
}
