import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';
import type { User } from 'next-auth';

export async function requireUser(): Promise<Omit<User, 'id'> & { id: string }> {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    redirect(routes.signin);
  }
  return { ...session.user, id: session.user.id };
}
