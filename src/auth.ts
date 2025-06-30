import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

// database adapter
import NeonAdapter from '@auth/neon-adapter';
import { Pool } from '@neondatabase/serverless';

// validation
import { signInSchema } from '@/lib/zod';
import bcrypt from 'bcrypt';
import { getUser } from '@/lib/data';
import type { AuthenticatedUser } from '@/lib/definitions';

const providers: Provider[] = [
  Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
      const parsedCredentials = signInSchema.safeParse(credentials);
      if (!parsedCredentials.success) {
        console.error('Invalid credentials');
        return null;
      }
      const { email, password } = parsedCredentials.data;
      const user = await getUser(email);
      if (!user) return null;
      const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordsMatch) return null;
      return user as AuthenticatedUser;
    },
  }),
  GitHub,
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


export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool),
    session: { strategy: 'jwt' },
    providers,
    pages: {
      signIn: '/login',
    },
  };
});
