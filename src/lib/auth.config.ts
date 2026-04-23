/* ---------------------------------------------------------------------------

NextAuth Configuration

An edge-compatible Auth.js configuration object to be exported and
used everywhere. This *will not* include the database adapter.

Contains all common configuration options which do not rely on the
edge incompatible adapter.

-----------------------------------------------------------------------------

- This is an object, not a full Auth.js instance
- Contains middleware that runs in an edge runtime
- Can use *only* Auth.js / next-auth and no other library

-----------------------------------------------------------------------------

Read more:
https://authjs.dev/guides/edge-compatibility
https://authjs.dev/getting-started/migrating-to-v5

*/

import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

const providers: Provider[] = [GitHub, Google];

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

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;
      // const isAdminRoute = nextUrl.pathname.startsWith('/play') || nextUrl.pathname.startsWith('/user');
      // const isAuthRoute = nextUrl.pathname.startsWith('/auth');

      // if (isAdminRoute) {
      //   if (isLoggedIn) return true;
      //   return false;
      // }

      // if (isLoggedIn && isAuthRoute) {
      //   return Response.redirect(new URL(routes.dashboard, nextUrl));
      // }

      // Allow access to all other routes
      return true;
    },
    // Add user ID to the token and session
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
