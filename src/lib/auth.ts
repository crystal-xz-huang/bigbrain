import authConfig from '@/lib/auth.config';
import NextAuth from 'next-auth';

import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { fetchUser } from '@/lib/data';
import { signInSchema } from '@/lib/zod';

// Main Auth.js configuration with db adapter
// This is NOT edge compatible, so it should not be used in Middleware.

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    // Credentials provider
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error('Invalid credentials');
          return null;
        }
        const { email, password } = parsedCredentials.data;
        return await fetchUser(email, password);
      },
    }),
    // Add other providers here, e.g., GitHub, Google, etc.
    GitHub({}),
  ],
});
