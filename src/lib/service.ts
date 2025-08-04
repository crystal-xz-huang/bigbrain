import { auth } from '@/auth';
import { AccessError, InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import type { User } from 'next-auth';

/***************************************************************
                      Auth Functions
***************************************************************/

export async function getAuthUser(): Promise<User> {
  const session = await auth();
  if (!session || !session.user) throw new AccessError('Unauthorized access');
  console.log('Authenticated user:', session.user);
  return session.user;
}

/***************************************************************
                      Game Functions
***************************************************************/

export async function assertOwnsGame(
  userId: string,
  gameId: string
): Promise<void> {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new InputError('Invalid game ID');
  if (game.ownerId !== userId)
    throw new AccessError('Admin does not own this game');
}
