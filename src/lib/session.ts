import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';
import type { User } from 'next-auth';

export async function requireUser(): Promise<User> {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.signin);
  }
  return session.user;
}
