'use server';

import { verifyUser } from '@/lib/data/auth';
import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import {
  Game,
  Question,
  QuestionAnswer,
  GameStatus,
  GameVisibility,
  GameSession,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  PRISMA_UNIQUE_CONSTRAINT_ERROR,
  SESSION_PIN_LENGTH,
} from '@/lib/definitions/constants';
import { generateId } from '@/lib/utils';

/***************************************************************
                      Helper Functions
***************************************************************/

async function assertOwnsSession(
  userId: string,
  sessionId: string
): Promise<void> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw new InputError('Invalid session ID');
  if (session.hostId !== userId)
    throw new AccessError('Admin does not own this session');
}

async function assertPlayerInSession(
  playerId: string,
  sessionId: string
): Promise<void> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: { sessionId: true },
  });
  if (!player) throw new InputError('Invalid player ID');
  if (player.sessionId !== sessionId)
    throw new AccessError('Player not in this session');
}

const newSessionPin = async (): Promise<string> => {
  const sessions = await prisma.gameSession.findMany({
    select: { pin: true },
  });
  const existingPins = sessions.map((s) => s.pin);
  return generateId(existingPins, SESSION_PIN_LENGTH);
};

const assertOwnsGameOrHasAccess = (
  user: { id: string },
  game: Partial<{
    ownerId: string;
    visibility: GameVisibility;
    status: GameStatus;
  }>
) => {
  // Can only play if game is published AND either owned by user or public
  if (game.status !== GameStatus.PUBLISHED) {
    throw new AccessError('Game is not published');
  }
  if (game.ownerId !== user.id && game.visibility !== GameVisibility.PUBLIC) {
    throw new AccessError('User does not have access to this game');
  }
};

type GameWithQuestionsAndAnswers = Game & {
  questions: (Question & {
    answers: QuestionAnswer[];
  })[];
};

const assertValidGame = (game: GameWithQuestionsAndAnswers) => {
  if (game.questions.length === 0)
    throw new InputError('Game is incomplete: missing questions');
  if (game.questions.some((q) => q.title.trim() === ''))
    throw new InputError('Game is incomplete: empty questions');
  if (game.questions.some((q) => q.answers.length === 0))
    throw new InputError('Game is incomplete: missing answers');
  if (game.questions.some((q) => q.answers.some((a) => a.title.trim() === '')))
    throw new InputError('Game is incomplete: empty answers');
};

/***************************************************************
                     Game Session Management
***************************************************************/

/**
 * Create a new game session for the given game ID.
 * This will start a new session with a unique pin and return the session details.
 *
 * @param gameId The ID of the game to start a session for
 * @returns The created game session
 * @throws Error
 */
export async function playGame(gameId: string): Promise<GameSession> {
  const user = await verifyUser();
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      questions: { orderBy: { createdAt: 'asc' }, include: { answers: true } },
    },
  });

  if (!game) throw new InputError('Invalid game ID');
  assertValidGame(game);
  assertOwnsGameOrHasAccess(user, game);

  try {
    return await prisma.$transaction(async (tx) => {
      // Check if the user already has an active session for this game
      // i.e. Lock the session to prevent concurrent starts
      await tx.activeSessionLock.create({ data: { gameId, hostId: user.id } });

      // Create a new session
      const pin = await newSessionPin();
      const newSession = await tx.gameSession.create({
        data: {
          gameId: game.id,
          hostId: user.id,
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
              image: q.image,
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
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
    ) {
      throw new InputError('Game already has an active session');
    }
    throw e;
  }
}

/***************************************************************
                      Session Functions
***************************************************************/

async function getSessionFromIdThrow(sessionId: string): Promise<AdminSession> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      host: true,
      players: { orderBy: { joinedAt: 'asc' } },
      questions: { orderBy: { position: 'asc' }, include: { answers: true } },
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
    const session = await getSessionFromIdThrow(sessionId);
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

  const session = await getSessionFromIdThrow(sessionId);
  if (!session.active) throw new InputError('Cannot lock an inactive session');
  if (session.startedAt)
    throw new InputError('Cannot lock a session that has already begun');

  await prisma.gameSession.update({
    where: { id: sessionId, hostId: userId, active: true },
    data: { locked: locked },
  });

  return await getSessionFromIdThrow(sessionId);
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
    return await getSessionFromIdThrow(sessionId);
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
    return await getSessionFromIdThrow(sessionId);
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

/***************************************************************
                     Player Functions
***************************************************************/

async function getSessionFromPinThrow(pin: string): Promise<PlayerSession> {
  const session = await prisma.gameSession.findUnique({
    where: { pin },
    include: {
      host: true,
      players: { orderBy: { joinedAt: 'asc' } },
      questions: {
        orderBy: { position: 'asc' },
        include: { answers: { select: { id: true, title: true } } },
      },
    },
  });
  if (!session) throw new InputError('Invalid session PIN');
  return session;
}

export async function fetchSessionFromPin(
  pin: string
): Promise<PlayerSession | null> {
  try {
    return await getSessionFromPinThrow(pin);
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
    const session = await getSessionFromPinThrow(pin);
    await assertPlayerInSession(playerId, session.id);
    return session;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function playerJoin(
  pin: string,
  name: string,
  image?: string
): Promise<Player> {
  const session = await getSessionFromPinThrow(pin);
  if (!session.active) throw new InputError('Cannot join an inactive session');
  if (session.locked) throw new InputError('Cannot join a locked session');
  if (session.startedAt) throw new InputError('Session has already begun');

  // Create a new player
  try {
    const player = await prisma.player.create({
      data: { sessionId: session.id, name, image },
    });
    return player;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new InputError('Nickname already taken');
    }
    console.error('Database Error:', err);
    throw new Error('Failed to join session');
  }
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

    const selectedAnswerIds = validatePlayerSelection(
      payload,
      q.type,
      q.answers
    );
    await tx.selectedAnswer.deleteMany({
      where: { playerAnswerId: playerAnswer.id },
    });
    if (selectedAnswerIds.length) {
      await tx.selectedAnswer.createMany({
        data: selectedAnswerIds.map((answerId) => ({
          playerAnswerId: playerAnswer.id,
          answerId,
        })),
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
      correctAnswerIds: q.answers.filter((a) => a.correct).map((a) => a.id),
    };
  });
}

export async function verifySessionPin(pin: string): Promise<boolean> {
  try {
    const session = await prisma.gameSession.findUnique({
      where: { pin },
    });
    return !!session;
  } catch (error) {
    console.error('Database Error:', error);
    return false;
  }
}
