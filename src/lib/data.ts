import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import {
  assertOwnsGame,
  assertOwnsQuestion,
  assertOwnsSession,
  getAuthUser,
} from '@/lib/service';
import {
  AdminGames,
  AuthUser,
  GameWithQuestions,
  MutationType,
  QuestionWithAnswers,
  UpdateGameFormData,
  AdminSession,
  PlayerSession,
} from '@/lib/types';
import { generateId } from '@/lib/utils';
import {
  Game,
  GameSession,
  QuestionType,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import type { User } from 'next-auth';

/***************************************************************
                      Helper Functions
***************************************************************/

const newSessionPin = async (): Promise<string> => {
  const sessions = await prisma.gameSession.findMany({
    select: { pin: true },
  });
  const existingPins = sessions.map((s) => s.pin);
  return generateId(existingPins, 999999);
};

async function getActiveSessionIdFromGameId(
  userId: string,
  gameId: string
): Promise<string | null> {
  const session = await prisma.gameSession.findFirst({
    where: { gameId: gameId, hostId: userId, active: true },
  });
  return session ? session.id : null;
}

async function getInactiveSessionsIdFromGameId(
  userId: string,
  gameId: string
): Promise<string[]> {
  const sessions = await prisma.gameSession.findMany({
    where: { gameId: gameId, hostId: userId, active: false },
    select: { id: true },
  });
  return sessions.map((s) => s.id);
}

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
  userId: string,
  gameName: string
): Promise<Game | null> {
  try {
    const game = await prisma.game.create({
      data: {
        name: gameName,
        ownerId: userId,
      },
    });
    return game;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create game');
  }
}

export async function deleteGame(
  userId: string,
  gameId: string
): Promise<void> {
  try {
    await assertOwnsGame(userId, gameId);
    await prisma.game.delete({
      where: { id: gameId },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete game');
  }
}

export async function updateGame(
  userId: string,
  gameId: string,
  data: UpdateGameFormData
): Promise<GameWithQuestions | null> {
  try {
    await assertOwnsGame(userId, gameId);
    // Update game
    await prisma.game.update({
      where: { id: gameId },
      data: {
        name: data.name,
        description: data.description,
        image: data.image as string,
      },
    });

    // Delete existing questions + answers
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
    const updatedGame = await fetchGameById(gameId);
    return updatedGame;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function cloneGame(
  userId: string,
  gameId: string
): Promise<GameWithQuestions | null> {
  try {
    await assertOwnsGame(userId, gameId);
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
  userId: string
): Promise<AdminGames | null> {
  try {
    const games = await prisma.game.findMany({
      where: { ownerId: userId },
      include: {
        questions: true,
        owner: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      games.map(async (game) => {
        const activeSession = await getActiveSessionIdFromGameId(userId, game.id);
        const oldSessions = await getInactiveSessionsIdFromGameId(userId, game.id);
        return {
          ...game,
          active: activeSession,
          oldSessions,
        };
      })
    );
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredGames(
  query: string,
  currentPage: number,
  userId: string
): Promise<AdminGames> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const games = await prisma.game.findMany({
      where: {
        ownerId: userId,
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

    return Promise.all(
      games.map(async (game) => {
        const activeSession = await getActiveSessionIdFromGameId(userId, game.id);
        const oldSessions = await getInactiveSessionsIdFromGameId(userId, game.id);
        return {
          ...game,
          active: activeSession,
          oldSessions,
        };
      })
    );
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

export async function createQuestion(
  userId: string,
  gameId: string,
  type: QuestionType
): Promise<QuestionWithAnswers | null> {
  try {
    await assertOwnsGame(userId, gameId);

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
  userId: string,
  questionId: string
): Promise<void> {
  try {
    await assertOwnsQuestion(userId, questionId);
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

export async function gameHasActiveSession(
  userId: string,
  gameId: string
): Promise<boolean> {
  const session = await prisma.gameSession.findFirst({
    where: { gameId: gameId, hostId: userId, active: true },
  });
  return !!session;
}

export async function startGame(
  userId: string,
  gameId: string
): Promise<GameSession> {
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

  if (!game) throw new InputError('Invalid game ID');
  if (game.questions.length === 0)
    throw new InputError('Game is incomplete: missing questions');
  if (game.questions.some((q) => q.answers.length === 0))
    throw new InputError('Game is incomplete: missing answers');

  const hasActiveSession = await gameHasActiveSession(userId, gameId);
  if (hasActiveSession)
    throw new InputError('Game already has an active session');

  const pin = await newSessionPin();
  const session = await prisma.gameSession.create({
    data: {
      gameId: gameId,
      hostId: userId,
      pin: pin,
      active: true,
      position: -1,
      startedAt: null,
      timeLastQuestionStarted: null,
      questions: {
        // copy questions to session
        create: game.questions.map((q) => ({
          title: q.title,
          type: q.type,
          duration: q.duration,
          points: q.points,
          hint: q.hint,
          answers: {
            create: q.answers.map((a) => ({
              title: a.title,
              correct: a.correct,
            })),
          },
        })),
      },
    },
  });

  return session;
}

/***************************************************************
                      Session Functions
***************************************************************/

async function getSessionFromIdThrow(sessionId: string): Promise<AdminSession> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      players: true,
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });
  if (!session) throw new InputError('Invalid session ID');
  return session;
}

async function startSession(sessionId: string): Promise<void> {
  const session = await getSessionFromIdThrow(sessionId);
  if (!session.active)
    throw new InputError('Cannot start a session that is not active');
  if (session.locked) throw new InputError('Cannot start a locked session');
  if (session.position >= 0)
    throw new InputError('Cannot start a session that has already begun');

  const start = new Date();

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      position: 0,
      startedAt: new Date(),
      timeLastQuestionStarted: new Date(Date.now() + 20000), // start 20s later
    },
  });
}

async function advanceSession(sessionId: string): Promise<void> {
  const session = await getSessionFromIdThrow(sessionId);
  if (!session.active)
    throw new InputError('Cannot advance a session that is not active');

  const totalQuestions = session.questions.length;
  const newPosition = session.position + 1;

  if (newPosition >= totalQuestions) {
    await endSession(sessionId);
    return;
  }

  await prisma.gameSession.update({
    where: { id: session.id },
    data: {
      position: newPosition,
      timeLastQuestionStarted: new Date(),
    },
  });
}

async function endSession(sessionId: string): Promise<void> {
  await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      active: false,
    },
  });
}

export async function mutateSession({
  userId,
  sessionId,
  mutationType,
}: {
  userId: string;
  sessionId: string;
  mutationType: MutationType;
}): Promise<AdminSession> {
  try {
    await assertOwnsSession(userId, sessionId);
    switch (mutationType) {
      case MutationType.START:
        await startSession(sessionId);
        break;
      case MutationType.ADVANCE:
        await advanceSession(sessionId);
        break;
      case MutationType.END:
        await endSession(sessionId);
        break;
      default:
        throw new InputError('Invalid mutation type');
    }
    return await getSessionFromIdThrow(sessionId);
  } catch (error) {
    throw error instanceof InputError
      ? error
      : new Error('Failed to mutate game: ' + (error as Error).message);
  }
}

export async function lockSession({
  userId,
  sessionId,
  locked,
}: {
  userId: string;
  sessionId: string;
  locked: boolean;
}): Promise<AdminSession> {
  await assertOwnsSession(userId, sessionId);
  const session = await getSessionFromIdThrow(sessionId);
  if (!session.active)
    throw new InputError('Cannot lock a session that is not active');
  if (session.position >= 0)
    throw new InputError('Cannot lock a session that has already begun');

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { locked: locked },
  });

  return await getSessionFromIdThrow(sessionId);
}

export async function fetchSessionFromAdmin(
  userId: string,
  sessionId: string
): Promise<AdminSession | null> {
  try {
    await assertOwnsSession(userId, sessionId);
    const session = await getSessionFromIdThrow(sessionId);
    if (session.hostId !== userId)
      throw new InputError('Admin does not own this session');
    return session;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function fetchSessionFromPlayer(
  playerId: string,
  pin: string
): Promise<PlayerSession | null> {
  try {
    const session = await prisma.gameSession.findFirst({
      where: { pin: pin, players: { some: { id: playerId } } },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!session) return null;

    // Ensure the player is part of the session
    if (!session.players.some((p) => p.id === playerId)) {
      throw new InputError('Player not found in this session');
    }

    return session as PlayerSession;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}