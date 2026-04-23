import { verifyUser } from '@/lib/data/auth';
import { toPublicGameDTO } from '@/lib/data/game-dto';
import {
  ORDER_BY_MOST_RECENT,
  SELECT_GAME_COLUMNS_WITHOUT_OWNER,
  SELECT_USER_COLUMNS,
  WHERE_PUBLIC,
} from '@/lib/definitions/constants';
import type {
  ProfileBannerDTO,
  ProfileDTO,
  UserDTO,
} from '@/lib/definitions/types';
import { InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';

/***************************************************************
                     User DTOs
***************************************************************/

export const getUserFromIdThrow = async (id: string): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: SELECT_USER_COLUMNS,
  });
  if (!user) throw new InputError('Invalid user ID');
  return user;
};

export const getUserFromEmailThrow = async (
  email: string
): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: SELECT_USER_COLUMNS,
  });
  if (!user) throw new InputError('Invalid email');
  return user;
};

export const getUserFromUsernameThrow = async (
  username: string
): Promise<UserDTO> => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: SELECT_USER_COLUMNS,
  });
  if (!user) throw new InputError('Invalid username');
  return user;
};

/***************************************************************
                     User Profile
***************************************************************/

export async function getProfileDTO(username: string): Promise<ProfileDTO> {
  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: {
      image: true,
      games: {
        where: WHERE_PUBLIC,
        orderBy: ORDER_BY_MOST_RECENT,
        select: SELECT_GAME_COLUMNS_WITHOUT_OWNER,
      },
    },
  });
  if (!profileUser) throw new Error('User not found');
  return {
    username,
    image: profileUser.image,
    games: profileUser.games.map(toPublicGameDTO),
  };
}

export async function getProfileBannerDTO(): Promise<ProfileBannerDTO | null> {
  const user = await verifyUser();

  try {
    // Need createdAt, games count and sessions count
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            games: true,
            gameSessions: true,
          },
        },
      },
    });

    if (!data) return null;

    return {
      username: user.username,
      name: user.name || null,
      email: user.email,
      image: user.image,
      stats: {
        createdAt: data.createdAt.toISOString(),
        games: data._count.games,
        plays: data._count.gameSessions,
      },
    };
  } catch (error) {
    console.error('Failed to fetch profile banner data:', error);
    return null;
  }
}
