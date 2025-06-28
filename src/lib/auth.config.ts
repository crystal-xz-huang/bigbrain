import type { NextAuthConfig } from 'next-auth';

// Edge-compatible Auth.js configuration
// For use in Middleware or API routes.

export default {
  pages: {
    signIn: '/login',
  },
  providers: [],
} satisfies NextAuthConfig;
