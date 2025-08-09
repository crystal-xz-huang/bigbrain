import { auth } from '@/auth';
import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import type { User } from 'next-auth';

/***************************************************************
                      Auth Functions
***************************************************************/
export async function getAuthUser(): Promise<Omit<User, 'id'> & { id: string }> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new AccessError('Unauthorized access');
  return { ...session.user, id: session.user.id };
}

export async function assertOwnsGame(
  userId: string,
  gameId: string
): Promise<void> {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new InputError('Invalid game ID');
  if (game.ownerId !== userId)
    throw new AccessError('Admin does not own this game');
}

export async function assertOwnsQuestion(userId:string, questionId: string): Promise<void> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) throw new InputError('Invalid question ID');

  const game = await prisma.game.findUnique({
    where: { id: question.gameId },
  });
  if (!game) throw new InputError('Game not found for question ID');
  if (game.ownerId !== userId)
    throw new AccessError('Cannot modify games owned by other admins');
}

export async function assertOwnsSession(userId:string, sessionId: string): Promise<void> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw new InputError('Invalid session ID');
  if (session.hostId !== userId)
    throw new AccessError('Admin does not own this session');
}
