import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// providers
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

// database adapter
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// validation
import { signInSchema } from '@/lib/zod';
import { fetchUserByCredentials } from '@/lib/data';

import { ZodError } from 'zod';

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
      try {
        // Validate the credentials using Zod schema
        const { email, password } = await signInSchema.parseAsync(credentials);
        // Return a User or null
        return await fetchUserByCredentials(email, password);
      } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
          return null;
        }
        // Handle other errors
        console.error('Authorization error', error);
        throw error;
      }
    },
  }),
  GitHub,
  Google
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
});
