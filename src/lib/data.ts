import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import type { AuthUser, Game } from '@/lib/types';
import type { User } from 'next-auth';

/***************************************************************
                     Auth
***************************************************************/
export async function getUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return null;

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) return null;

  return user as AuthUser;
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
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

/***************************************************************
                     Game
***************************************************************/
export async function createGame(
  name: string,
  user: AuthUser
): Promise<Game | null> {
  try {
    const game = await prisma.game.create({
      data: {
        name,
        ownerId: user.id,
      },
      include: {
        owner: true,
        questions: true,
      },
    });
    return game;
  } catch (error) {
    console.error('Error creating game:', error);
    return null;
  }
}

export async function getGames(user: User): Promise<Game[]> {
  try {
    const games = await prisma.game.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: 'desc' }, // Show most recent games first
      include: { questions: true },
    });
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

export async function deleteGame(gameId: string, user: AuthUser): Promise<boolean> {
  try {
    await prisma.game.delete({
      where: {
        id: gameId,
        ownerId: user.id,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting game:', error);
    return false;
  }
}