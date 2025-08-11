import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import {
  assertOwnsGame,
  assertOwnsQuestion,
  assertOwnsSession,
  assertPlayerInSession,
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
  PlayerAnswerPayload,
} from '@/lib/types';
import { generateId, gradePlayerSelection, validatePlayerSelection } from '@/lib/utils';
import {
  type Game,
  type GameSession,
  PrismaClientKnownRequestError,
  QuestionType,
} from '@prisma/client';
import type { User } from 'next-auth';
import bcrypt from 'bcrypt';
import { assert } from 'node:console';

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
        const activeSession = await getActiveSessionIdFromGameId(
          userId,
          game.id
        );
        const oldSessions = await getInactiveSessionsIdFromGameId(
          userId,
          game.id
        );
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
        const activeSession = await getActiveSessionIdFromGameId(
          userId,
          game.id
        );
        const oldSessions = await getInactiveSessionsIdFromGameId(
          userId,
          game.id
        );
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

/***************************************************************
                      Session Functions
***************************************************************/

async function getAdminSessionFromIdThrow(sessionId: string): Promise<AdminSession> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      players: { orderBy: { joinedAt: 'asc' } },
      questions: { orderBy: { position: 'asc' }, include: { answers: true } },
    },
  });
  if (!session) throw new InputError('Invalid session ID');
  return session;
}

async function getPlayerSessionFromIdThrow(sessionId: string): Promise<PlayerSession> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      players: { orderBy: { joinedAt: 'asc' } },
      questions: {
        orderBy: { position: 'asc' },
        include: { answers: { select: { id: true, title: true },}
        }
      },
    },
  });
  if (!session) throw new InputError('Invalid session ID');
  return session;
}

export async function startGame(
  userId: string,
  gameId: string
): Promise<GameSession> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      questions: { orderBy: { createdAt: 'asc' }, include: { answers: true } },
    },
  });

  if (!game) throw new InputError('Invalid game ID');
  if (game.questions.length === 0)
    throw new InputError('Game is incomplete: missing questions');
  if (game.questions.some((q) => q.answers.length === 0))
    throw new InputError('Game is incomplete: missing answers');

  try {
    return await prisma.$transaction(async (tx) => {
      // Check if the user already has an active session for this game
      // i.e. Lock the session to prevent concurrent starts
      await tx.activeSessionLock.create({ data: { gameId, hostId: userId } });

      // Create a new session
      const pin = await newSessionPin();
      const newSession = await tx.gameSession.create({
        data: {
          gameId: game.id,
          hostId: userId,
          pin: pin,
          active: true,
          questions: {
            create: game.questions.map((q, idx) => ({
              position: idx + 1,
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

      return newSession;
    });
  } catch (e) {
    console.error('Database Error:', e);
    if (
      e instanceof PrismaClientKnownRequestError &&
      (e as PrismaClientKnownRequestError).code === 'P2002' // Unique constraint failed
    ) {
      throw new InputError('Game already has an active session');
    }
    throw new Error('Failed to start game session');
  }
}

async function startSession(sessionId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const session = await getAdminSessionFromIdThrow(sessionId);
    if (!session.active)
      throw new InputError('Cannot start a session that is not active');
    if (session.locked) throw new InputError('Cannot start a locked session');
    if (session.startedAt)
      throw new InputError('Cannot start a session that has already begun');

    const now = new Date();
    const t0 = new Date(now.getTime() + 20 * 1000); // start in 20 seconds
    let start = new Date(t0); // temp for question start times

    // precompute and persist timestamps for each question
    for (const q of session.questions) {
      const startAt = new Date(start);
      const answersAvailableAt = new Date(
        startAt.getTime() + q.duration * 1000
      ); // duration in seconds
      let endAt = new Date(answersAvailableAt.getTime() + 10 * 1000); // 10s to reveal answers
      if (session.showLeaderboard)
        endAt = new Date(answersAvailableAt.getTime() + 20 * 1000); // 20s if leaderboard is shown

      await tx.gameSessionQuestion.update({
        where: { id: q.id },
        data: { startAt, answersAvailableAt, endAt },
      });

      start = endAt; // next question starts after reveal
    }

    // Update the session to mark it as started
    return await tx.gameSession.update({
      where: { id: sessionId },
      data: {
        startedAt: now,
      },
    });
  });
}

async function endSession(sessionId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Update the session to mark it as inactive
    const session = await tx.gameSession.update({
      where: { id: sessionId },
      data: { active: false, endedAt: new Date() },
      select: { gameId: true, hostId: true },
    });
    // Release (delete) the active session lock
    await tx.activeSessionLock.delete({
      where: {
        gameId_hostId: { gameId: session.gameId, hostId: session.hostId },
      },
    });
  });
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

  const session = await getAdminSessionFromIdThrow(sessionId);
  if (!session.active) throw new InputError('Cannot lock an inactive session');
  if (session.startedAt)
    throw new InputError('Cannot lock a session that has already begun');

  await prisma.gameSession.update({
    where: { id: sessionId, hostId: userId, active: true },
    data: { locked: locked },
  });

  return await getAdminSessionFromIdThrow(sessionId);
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
      case MutationType.END:
        await endSession(sessionId);
        break;
      default:
        throw new InputError('Invalid mutation type');
    }
    return await getAdminSessionFromIdThrow(sessionId);
  } catch (error) {
    throw error instanceof InputError
      ? error
      : new Error('Failed to mutate game: ' + (error as Error).message);
  }
}

export async function fetchSessionFromAdmin(
  userId: string,
  sessionId: string
): Promise<AdminSession | null> {
  try {
    await assertOwnsSession(userId, sessionId);
    return await getAdminSessionFromIdThrow(sessionId);
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

/***************************************************************
                     Player Functions
***************************************************************/

export async function fetchSessionFromPin(pin: string): Promise <PlayerSession | null> {
  try {
    const session = await prisma.gameSession.findUnique({
      where: { pin },
      include: {
        players: { orderBy: { joinedAt: 'asc' } },
        questions: {
          orderBy: { position: 'asc' },
          include: { answers: { select: { id: true, title: true } } },
        },
      },
    });
    if (!session) return null;
    return session;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function fetchSessionFromPlayer(playerId: string, sessionId: string): Promise<PlayerSession | null> {
  try {
    await assertPlayerInSession(playerId, sessionId);
    return await getPlayerSessionFromIdThrow(sessionId);
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function playerJoin(name: string, sessionId: string) {
  const session = await getAdminSessionFromIdThrow(sessionId);
  if (!session.active) throw new InputError('Cannot join an inactive session');
  if (session.locked) throw new InputError('Cannot join a locked session');
  if (session.startedAt) throw new InputError('Session has already begun');

  const player = await prisma.player.upsert({
    where: { sessionId_name: { sessionId, name } }, // unique constraint
    update: {}, // no update needed, just ensure it exists
    create: { sessionId, name }, // create if it doesn't exist
  });

  return player;
}

export async function playerSubmitAnswers(
  playerId: string,
  questionId: string,
  payload: PlayerAnswerPayload
) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const q = await tx.gameSessionQuestion.findUnique({
      where: { id: questionId },
      include: {
        session: { select: { id: true, active: true, locked: true } },
        answers: true,
      },
    });

    if (!q) throw new InputError('Invalid question ID');
    if (!q.session.active)
      throw new InputError('Cannot submit answers to an inactive session');
    if (q.session.locked)
      throw new InputError('Cannot submit answers to a locked session');
    if (!q.startAt || !q.answersAvailableAt)
      throw new InputError('Question not ready for submission');
    if (!(now >= q.startAt && now < q.answersAvailableAt))
      throw new InputError('Submissions are closed for this question');

    await assertPlayerInSession(playerId, q.session.id);

    // Upsert the player's answer
    const playerAnswer = await tx.playerAnswer.upsert({
      where: { playerId_questionId: { playerId, questionId } },
      update: { submittedAt: now },
      create: { playerId, questionId, submittedAt: now },
      select: { id: true },
    });

    const selectedAnswerIds = validatePlayerSelection(payload, q.type, q.answers);
    await tx.selectedAnswer.deleteMany({ where: { playerAnswerId: playerAnswer.id } });
    if (selectedAnswerIds.length) {
      await tx.selectedAnswer.createMany({
        data: selectedAnswerIds.map(answerId => ({ playerAnswerId: playerAnswer.id, answerId })),
        skipDuplicates: true,
      });
    }

    // Grade the player's selection
    const correct = gradePlayerSelection(selectedAnswerIds, q.type, q.answers);
    await tx.playerAnswer.update({
      where: { id: playerAnswer.id },
      data: { correct: correct as boolean | null },
    });

    return {
      playerAnswerId: playerAnswer.id,
      correct,
      selectedAnswerIds,
      correctAnswerIds: q.answers.filter(a => a.correct).map(a => a.id),
    };
  });
}
