import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function getUser(email: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) return null;

  return user as Omit<User, 'passwordHash'>;
}
