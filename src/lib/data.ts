import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/***************************************************************
  WARNING: Edge Compatibility
  - Everything in this file is NOT edge compatible.
  - Do not use this file in Middleware or 

***************************************************************/
export async function fetchUser(
  email: string,
  password: string
): Promise<Omit<User, 'passwordHash'> | null> {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Logic to verify if the user exists and password is correct
  if (!user || !user.passwordHash) return null;

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (passwordsMatch) {
    const { passwordHash, ...userWithoutPwHash } = user;
    return userWithoutPwHash;
  }

  return null;
}
