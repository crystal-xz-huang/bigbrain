import { verifyUser } from '@/lib/data/auth';
import { UpdateGameTypeEnum } from '@/lib/definitions/constants';
import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import { PublishGameFormData, SaveGameFormData } from '@/lib/zod';
import { GameStatus, GameVisibility } from '@prisma/client';
import { forbidden } from 'next/navigation';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PRISMA_UNIQUE_CONSTRAINT_ERROR } from '@/lib/definitions/constants';

/***************************************************************
                     Helper Functions
***************************************************************/

const assertOwnsGame = async (
  userId: string,
  gameId: string
): Promise<void> => {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new InputError('Invalid game ID');
  if (game.ownerId !== userId)
    throw new AccessError('User does not own this game');
};

/***************************************************************
                     Mutation Functions
***************************************************************/

/**
 * Create a new game for the current user, with the given name.
 *
 * @param gameName
 * @returns The ID of the newly created game, or null if creation failed
 * @throws {Error} If there was a problem creating the game
 */
export async function createGame(gameName: string): Promise<string> {
  const user = await verifyUser();

  try {
    const game = await prisma.game.create({
      data: {
        name: gameName,
        ownerId: user.id,
      },
      select: { id: true },
    });
    return game.id;
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
    ) {
      throw new InputError(
        'A game with this name already exists. Please choose a different name.'
      );
    }
    console.error('Database error:', e);
    throw new Error('Failed to create game. Please try again.');
  }
}

/**
 * Delete a game by its ID, ensuring the current user owns it.
 *
 * @param gameId The ID of the game to delete
 * @return The name of the deleted game
 * @throws {Error} If the game does not exist or the user does not own it
 */
export async function deleteGame(gameId: string): Promise<string> {
  const user = await verifyUser();
  await assertOwnsGame(user.id, gameId);
  try {
    const game = await prisma.game.delete({
      where: { id: gameId, ownerId: user.id },
      select: { name: true },
    });
    return game.name;
  } catch (error) {
    console.error('Failed to delete game:', error);
    throw new Error('Failed to delete game. Please try again.');
  }
}

/**
 * Clone an existing game for the current user.
 *
 * @param gameId The ID of the game to fetch
 * @returns The ID of the cloned game, or null if cloning failed
 */
export async function cloneGame(gameId: string): Promise<string | null> {
  const user = await verifyUser();

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        categories: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!game) throw new InputError('Invalid game ID');
    // if game is not owned by user, they can only clone if it's public and published
    if (
      game.ownerId !== user.id &&
      (game.visibility !== GameVisibility.PUBLIC ||
        game.status !== GameStatus.PUBLISHED)
    ) {
      throw new AccessError(
        'Admin does not have permission to clone this game'
      );
    }

    const newGame = await prisma.game.create({
      data: {
        name: `${game.name} (Copy)`,
        description: game.description,
        image: game.image,
        ownerId: user.id,
        categories: {
          connect: game.categories.map((c) => ({ id: c.id })),
        },
        tags: game.tags,
        questions: {
          create: game.questions.map((q) => ({
            title: q.title,
            image: q.image,
            hint: q.hint,
            funfact: q.funfact,
            duration: q.duration,
            points: q.points,
            type: q.type,
            answers: {
              create: q.answers.map((a) => ({
                title: a.title,
                correct: a.correct,
              })),
            },
          })),
        },
      },
      select: { id: true },
    });

    return newGame.id;
  } catch (error) {
    console.error('Failed to clone game:', error);
    if (error instanceof AccessError) forbidden();
    return null;
  }
}

export async function updateGame(
  updateType: keyof typeof UpdateGameTypeEnum,
  payload: PublishGameFormData | SaveGameFormData,
  ownerId: string
): Promise<GameEditDTO | null> {
  const { id: gameId } = payload;
  const publishing = updateType === UpdateGameTypeEnum.PUBLISH;

  // Build ops (order matters inside the transaction)
  const ops = [];

  // (1) game metadata + categories + tags
  ops.push(
    prisma.game.update({
      where: { id: gameId, ownerId: ownerId },
      data: {
        name: payload.name,
        description: payload.description,
        image: payload.image,
        status: publishing ? GameStatus.PUBLISHED : GameStatus.DRAFT,
        visibility: payload.visibility ?? GameVisibility.PRIVATE,
        tags: payload.tags,
        categories: {
          set: payload.categories.map((id) => ({ id })),
        },
      },
    })
  );
  // (2) questions + answers (use updateMany for safe scoping to this game)
  for (const q of payload.questions) {
    ops.push(
      prisma.question.updateMany({
        where: { id: q.id, gameId },
        data: {
          title: q.title,
          hint: q.hint,
          funfact: q.funfact,
          type: q.type,
          duration: q.duration,
          points: q.points,
          image: q.image,
        },
      })
    );
    // (3) replace answers
    ops.push(prisma.questionAnswer.deleteMany({ where: { questionId: q.id } }));
    if (q.answers.length) {
      ops.push(
        prisma.questionAnswer.createMany({
          data: q.answers.map((a) => ({
            title: a.title,
            correct: !!a.correct,
            questionId: q.id,
          })),
        })
      );
    }
  }

  // Execute all operations in a transaction
  try {
    await prisma.$transaction(ops);
  } catch (error) {
    console.error('Failed to update game:', error);
    return null;
  }

  return await getGameEditDTO(gameId, ownerId);
}

/***************************************************************
                     Game Question Functions
***************************************************************/

import { QuestionType } from '@prisma/client';
import { GameEditDTO, QuestionDTO } from '@/lib/definitions/types';
import { getGameEditDTO } from '@/lib/data/game-dto';

/**
 * Create a new question for a game, based on the type.
 *
 * @param gameId The ID of the game to create the question for
 * @param type The type of question to create (SINGLE, MULTIPLE, TYPE_ANSWER)
 * @returns ID of the newly created question, or null if creation failed
 */
export async function createQuestion(
  gameId: string,
  type: QuestionType
): Promise<QuestionDTO | null> {
  const user = await verifyUser();
  try {
    await assertOwnsGame(user.id, gameId);

    let defaultAnswers;
    switch (type) {
      case QuestionType.SINGLE:
        defaultAnswers = [
          { title: '', correct: true },
          { title: '', correct: false },
          { title: '', correct: false },
          { title: '', correct: false },
        ];
        break;

      case QuestionType.MULTIPLE:
        defaultAnswers = [
          { title: '', correct: true },
          { title: '', correct: true },
          { title: '', correct: false },
          { title: '', correct: false },
        ];
        break;

      case QuestionType.TYPE_ANSWER:
        defaultAnswers = [{ title: '', correct: true }];
        break;

      default:
        throw new InputError('Invalid question type');
    }

    const question = await prisma.question.create({
      data: {
        gameId: gameId,
        type: type,
        title: '',
        answers: {
          create: defaultAnswers,
        },
      },
      include: {
        answers: true,
      },
    });

    return question as QuestionDTO;
  } catch (error) {
    console.error('Failed to create question:', error);
    return null;
  }
}

/**
 * Delete a question by its ID, ensuring the user owns it.
 *
 * @param questionId The ID of the question to delete
 * @returns void
 * @throws {Error} If the question does not exist or the user does not own it
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  const user = await verifyUser();
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { game: true },
    });
    if (!question) throw new InputError('Invalid question ID');
    if (question.game.ownerId !== user.id)
      throw new AccessError('Admin does not own this Game');

    await prisma.question.delete({ where: { id: questionId } });
  } catch (error) {
    console.error('Failed to delete question:', error);
    throw error;
  }
}

/**
 * Clone a question by its ID, adding it to the same game.
 * @param questionId The ID of the question to clone
 * @returns The cloned question, or null if cloning failed
 */
export async function cloneQuestion(
  questionId: string
): Promise<QuestionDTO | null> {
  const user = await verifyUser();
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        game: true,
        answers: true,
      },
    });
    if (!question) throw new InputError('Invalid question ID');
    if (question.game.ownerId !== user.id)
      throw new AccessError('Admin does not own this Game');

    const clonedQuestion = await prisma.question.create({
      data: {
        gameId: question.gameId,
        title: question.title,
        image: question.image,
        hint: question.hint,
        funfact: question.funfact,
        duration: question.duration,
        points: question.points,
        type: question.type,
        answers: {
          create: question.answers.map((a) => ({
            title: a.title,
            correct: a.correct,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return clonedQuestion;
  } catch (error) {
    console.error('Failed to clone question:', error);
    return null;
  }
}
