import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { cache } from 'react';
import { auth } from '@/auth';
import { routes } from '@/lib/routes';
import type { User } from 'next-auth';
import { redirect, forbidden } from 'next/navigation';
import { fetchUserById } from '@/lib/data';
import type { AuthUser } from '@/lib/types';

const verifySession = cache(async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect(routes.signin);
  }
  return { ...session, user: { ...session.user, id: session.user.id } };
});

export const getUser = cache(async (): Promise<AuthUser> => {
  const session = await verifySession();
  const user = await fetchUserById(session.user.id);
  if (!user) {
    forbidden();
  }
  return user;
});

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })
 
  const sessionId = data[0].id
 
  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })
 
  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
