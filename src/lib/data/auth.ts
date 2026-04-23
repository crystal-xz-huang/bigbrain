import { auth } from '@/auth';
import { getUserFromIdThrow } from '@/lib/data/user-dto';
import {
  PRISMA_UNIQUE_CONSTRAINT_ERROR,
  SELECT_USER_COLUMNS,
} from '@/lib/definitions/constants';
import type { SessionDTO, UserDTO } from '@/lib/definitions/types';
import { InputError } from '@/lib/error';
import { prisma } from '@/lib/prisma';
import { publicRoutes } from '@/lib/routes';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cache } from 'react';

/***************************************************************
                    Session Management
***************************************************************/

/**
 * Verify if the user is authenticated.
 * Does *not* redirect if not authenticated.
 * @returns {Promise<SessionDTO>} The session data or a non-authenticated session.
 */
export const getSession = cache(async (): Promise<SessionDTO> => {
  const session = await auth();
  if (!session?.user?.id) return { isAuth: false, userId: null };
  return { isAuth: true, userId: session.user.id };
});

/**
 * Get the current user from the session.
 * If the user is not authenticated, it redirects to the sign-in page.
 * @returns {Promise<UserDTO>} The user data if authenticated.
 */
export const verifyUser = cache(async (): Promise<UserDTO> => {
  const session = await getSession();
  if (!session.userId) redirect(publicRoutes.signin);
  try {
    const user = await getUserFromIdThrow(session.userId);
    return user;
  } catch (error) {
    console.error(
      'Failed to fetch current user. Redirecting to signin page.',
      error
    );
    redirect(publicRoutes.signin);
  }
});

/**
 * Get the viewer's user data.
 * Does *not* redirect if not authenticated. Returns null instead.
 * @returns {Promise<UserDTO | null>} The user data or null if not authenticated.
 */
export const getUserOrNull = cache(async (): Promise<UserDTO | null> => {
  const session = await getSession();
  if (!session.userId) return null;
  try {
    const user = await getUserFromIdThrow(session.userId);
    return user;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
});

/***************************************************************
                     Authentication
***************************************************************/

export async function verifyCredentials(
  email: string,
  password: string
): Promise<UserDTO | null> {
  const auth = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });
  if (!auth?.passwordHash) return null;

  const passwordsMatch = await bcrypt.compare(password, auth.passwordHash);
  if (!passwordsMatch) return null;

  try {
    const user = await getUserFromIdThrow(auth.id);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<UserDTO> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: SELECT_USER_COLUMNS,
    });
    return user;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
    ) {
      throw new InputError(
        'The email you are attempting to sign up with is already in use. Please log in or use a different email.'
      );
    }
    console.error('Failed to create user:', e);
    throw e;
  }
}
