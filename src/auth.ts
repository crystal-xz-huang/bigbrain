/* ---------------------------------------------------------------------------

NextAuth Configuration

This is an Auth.js instance, initialized with the common configuration options
from the edge-compatible auth.config.ts file.

This instance will include the database adapter.

-----------------------------------------------------------------------------

Read more:
https://authjs.dev/guides/edge-compatibility
https://authjs.dev/getting-started/migrating-to-v5

*/
import { authConfig } from '@/lib/auth.config';
import NextAuth from 'next-auth';

// Database Adapter
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

// Providers
import { getUserFromEmailThrow } from '@/lib/data/user-dto';
import { SignInSchema } from '@/lib/zod';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { ZodError } from 'zod';

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
      try {
        const parsed = await SignInSchema.parseAsync(credentials);
        const user = await getUserFromEmailThrow(parsed.email);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
          // Return `null` to indicate that the credentials are invalid
          return null;
        }
        // Handle other errors
        console.error('Failed to authorize credentials:', error);
        throw error;
      }
    },
  }),
  GitHub,
  Google,
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
