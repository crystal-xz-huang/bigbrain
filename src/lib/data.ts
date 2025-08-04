import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import { assertOwnsGame, getAuthUser } from '@/lib/service';
import type {
  AuthUser,
  GameWithQuestions,
  QuestionWithAnswers,
  UpdateGameFormData,
} from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Game, GameSession, QuestionType } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { User } from 'next-auth';

/***************************************************************
                      Helper Functions
***************************************************************/

const newSessionCode = async (): Promise<string> => {
  const sessions = await prisma.gameSession.findMany({
    select: { code: true },
  });
  const existingCodes = sessions.map((s) => s.code);
  return generateId(existingCodes, 999999);
};

/***************************************************************
                      Auth Functions
***************************************************************/

export async function fetchAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();
  const dbUser = await fetchUserByEmail(user.email as string);
  if (!dbUser) throw new AccessError('User not found');
  return dbUser;
}

export async function fetchUserByCredentials(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) return null;

  return user as AuthUser;
}

export async function fetchUserByEmail(
  email: string
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return user as AuthUser;
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    return user as AuthUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function fetchUserStats(user: User) {
  if (!user) return null;
  const [userRecord, gamesCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    }),
    prisma.game.count({ where: { ownerId: user.id } }),
  ]);
  return {
    joinedAt: userRecord?.createdAt,
    totalGames: gamesCount,
  };
}

/***************************************************************
                      Game Functions
***************************************************************/

export async function createGame(
  userId: string | undefined,
  gameName: string
): Promise<Game | null> {
  try {
    const game = await prisma.game.create({
      data: {
        name: gameName as string,
        ownerId: userId as string,
      },
    });
    return game;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create game');
  }
}

export async function deleteGame(
  userId: string | undefined,
  gameId: string
): Promise<void> {
  try {
    await assertOwnsGame(userId as string, gameId);
    await prisma.game.delete({
      where: { id: gameId, ownerId: userId as string },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete game');
  }
}

export async function saveGame(
  userId: string | undefined,
  gameId: string,
  data: UpdateGameFormData
): Promise<GameWithQuestions | null> {
  try {
    await assertOwnsGame(userId as string, gameId);

    // Update game
    const game = await prisma.game.update({
      where: { id: gameId, ownerId: userId as string },
      data: {
        name: data.name,
        description: data.description,
        image: data.image as string,
      },
    });

    // Fetch existing questions
    const existingQuestions = await prisma.question.findMany({
      where: { gameId },
      include: { answers: true },
    });
    const questionMap = new Map(existingQuestions.map((q) => [q.id, q]));

    for (const q of data.questions) {
      // Skip if no ID is provided
      if (!q.id) continue;
      const existing = questionMap.get(q.id);
      if (!existing) continue;

      // Update non-empty fields
      await prisma.question.update({
        where: { id: q.id },
        data: {
          title: q.title,
          type: q.type,
          duration: q.duration,
          points: q.points,
          hint: q.hint || existing.hint,
        },
      });

      // Update answers
      const answerMap = new Map(existing.answers.map((a) => [a.id, a]));

      for (const a of q.answers || []) {
        if (!a.id) {
          // New answer
          await prisma.questionAnswer.create({
            data: {
              questionId: q.id,
              title: a.title || '',
              correct: !!a.correct,
            },
          });
        } else {
          const existingAnswer = answerMap.get(a.id);
          if (!existingAnswer) continue;

          await prisma.questionAnswer.update({
            where: { id: a.id },
            data: {
              title: a.title || existingAnswer.title,
              correct:
                typeof a.correct === 'boolean'
                  ? a.correct
                  : existingAnswer.correct,
            },
          });
        }
      }
    }

    // Create new questions and answers
    for (const question of data.questions) {
      await prisma.question.create({
        data: {
          gameId,
          title: question.title,
          type: question.type,
          duration: question.duration,
          points: question.points,
          hint: question.hint,
          answers: {
            create: question.answers.map((answer) => ({
              title: answer.title,
              correct: answer.correct,
            })),
          },
        },
      });
    }

    // Return the updated game
    return game;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function updateGame(
  userId: string | undefined,
  gameId: string,
  data: UpdateGameFormData
): Promise<GameWithQuestions | null> {
  try {
    await assertOwnsGame(userId as string, gameId);

    // Update game
    const game = await prisma.game.update({
      where: { id: gameId, ownerId: userId as string },
      data: {
        name: data.name,
        description: data.description,
        image: data.image as string,
      },
    });

    // Delete existing questions
    await prisma.question.deleteMany({
      where: { gameId },
    });

    // Create new questions + answers
    for (const question of data.questions) {
      await prisma.question.create({
        data: {
          gameId,
          title: question.title,
          type: question.type,
          duration: question.duration,
          points: question.points,
          hint: question.hint,
          answers: {
            create: question.answers
              .filter((a) => a.title.trim() !== '') // Filter out empty answers
              .map((answer) => ({
                title: answer.title,
                correct: answer.correct,
              })),
          },
        },
      });
    }

    // Return the updated game
    return game;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function cloneGame(
  gameId: string
): Promise<GameWithQuestions | null> {
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!game) return null;

    // Create a new game with the same details
    const clonedGame = await prisma.game.create({
      data: {
        name: `${game.name} (Copy)`,
        description: game.description,
        image: game.image,
        ownerId: game.ownerId,
      },
    });

    // Clone questions and answers
    for (const question of game.questions) {
      await prisma.question.create({
        data: {
          gameId: clonedGame.id,
          title: question.title,
          type: question.type,
          duration: question.duration,
          points: question.points,
          hint: question.hint,
          answers: {
            create: question.answers.map((answer) => ({
              title: answer.title,
              correct: answer.correct,
            })),
          },
        },
      });
    }

    return fetchGameById(clonedGame.id);
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function fetchGameById(
  gameId: string
): Promise<GameWithQuestions | null> {
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        owner: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    return game;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function fetchGamesFromAdmin(
  user: User
): Promise<GameWithQuestions[] | null> {
  try {
    const games = await prisma.game.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' }, // Show most recent games first
      include: { owner: true, questions: true },
    });
    return games;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredGames(
  query: string,
  currentPage: number,
  user: User
): Promise<Game[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const games = await prisma.game.findMany({
      where: {
        ownerId: user.id,
        name: { contains: query, mode: 'insensitive' },
      },
      include: {
        questions: true,
        owner: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    return games;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch games.');
  }
}

export async function fetchGamesPages(
  query: string,
  user: User
): Promise<number> {
  try {
    const count = await prisma.game.count({
      where: {
        ownerId: user.id,
        name: { contains: query, mode: 'insensitive' },
      },
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of games.');
  }
}

/***************************************************************
                      Game Question Functions
***************************************************************/
const assertOwnsQuestion = async (
  userId: string | undefined,
  questionId: string
): Promise<void> => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) throw new InputError('Invalid question ID');

  const game = await prisma.game.findUnique({
    where: { id: question.gameId },
  });
  if (!game) throw new InputError('Game not found for question');
  if (game.ownerId !== userId)
    throw new AccessError('Cannot modify games owned by other admins');
};

export async function createQuestion(
  userId: string | undefined,
  gameId: string,
  type: QuestionType
): Promise<QuestionWithAnswers | null> {
  try {
    assertOwnsGame(userId as string, gameId);

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
        gameId,
        type: type,
        title: '',
        hint: '',
        duration: 20,
        points: 1,
        answers: {
          create: defaultAnswers,
        },
      },
      include: {
        answers: true,
      },
    });

    return question;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create question');
  }
}

export async function deleteQuestion(
  userId: string | undefined,
  questionId: string
): Promise<void> {
  try {
    await assertOwnsQuestion(userId as string, questionId);
    await prisma.question.delete({
      where: { id: questionId },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete question');
  }
}

export async function fetchQuestionsByGameId(
  gameId: string
): Promise<QuestionWithAnswers[] | null> {
  try {
    const questions = await prisma.question.findMany({
      where: { gameId },
      include: {
        answers: true,
      },
      orderBy: { createdAt: 'asc' }, // Order from oldest to newest
    });
    return questions;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch questions');
  }
}

/***************************************************************
                      Session Functions
***************************************************************/

async function startGame(gameId: string): Promise<GameSession> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) throw new Error('Game not found');
  if (game.active) throw new Error('Game already has active session');

  const code = await newSessionCode();
  const session = await prisma.gameSession.create({
    data: {
      gameId: gameId,
      hostId: game.ownerId,
      code: code,
      isoTimeLastQuestionStarted: new Date().toISOString(),
      position: 0,
      status: 'LOBBY',
    },
  });

  await prisma.game.update({
    where: { id: gameId },
    data: { active: session.id },
  });

  return session;
}

async function advanceGame(gameId: string): Promise<number> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!game) throw new Error('Game not found');
  if (!game.active) throw new Error('Cannot advance a game that is not active');

  const session = await prisma.gameSession.findUnique({
    where: { id: game.active },
  });

  if (!session) throw new Error('Session not found');
  if (session.status !== 'IN_PROGRESS')
    throw new Error('Cannot advance a session that is not in progress');

  const totalQuestions = game.questions.length;
  const newPosition = session.position + 1;

  if (newPosition >= totalQuestions) {
    await endGame(gameId);
    return newPosition;
  }

  await prisma.gameSession.update({
    where: { id: session.id },
    data: {
      position: newPosition,
      isoTimeLastQuestionStarted: new Date().toISOString(),
    },
  });

  return newPosition;
}

async function endGame(gameId: string): Promise<void> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) throw new Error('Game not found');
  if (!game.active) throw new Error('Cannot end a game that is not active');

  const session = await prisma.gameSession.findUnique({
    where: { id: game.active },
  });

  if (!session) throw new Error('Session not found');

  await prisma.gameSession.update({
    where: { id: session.id },
    data: { status: 'FINISHED' },
  });

  await prisma.game.update({
    where: { id: gameId },
    data: { active: null },
  });
}

export async function mutateGame({
  gameId,
  mutationType,
}: {
  gameId: string;
  mutationType: 'START' | 'ADVANCE' | 'END';
}) {
  try {
    switch (mutationType.toUpperCase()) {
      case 'START':
        const session = await startGame(gameId);
        return {
          status: 'started',
          sessionId: session.id,
          sessionCode: session.code,
        };
      case 'ADVANCE':
        const position = await advanceGame(gameId);
        return { status: 'advanced', position };
      case 'END':
        await endGame(gameId);
        return { status: 'ended' };
      default:
        throw new Error('Invalid mutation type');
    }
  } catch (error) {
    throw new Error('Failed to mutate game: ' + error);
  }
}
