import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import { signInSchema } from '@/lib/zod';
import { ZodError } from "zod"

export default {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password} = await signInSchema.parseAsync(credentials);
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          // Handle other errors (e.g., database errors)
          return null;
        }
      } 
    }),
  ],
} satisfies NextAuthConfig;
