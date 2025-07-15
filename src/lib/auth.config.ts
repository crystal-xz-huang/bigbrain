import { routes } from '@/lib/routes';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

// Edge-compatible configuration object for NextAuth.js

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
    signIn: routes.signin,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Redirect unauthenticated users to the login page,
      // otherwise allow access to the /admin/* pages
      const isLoggedIn = !!auth?.user;
      const isOnAdminRoute = nextUrl.pathname.startsWith('/admin');
      if (isOnAdminRoute) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        // redirect logged-in users to the dashboard
        return Response.redirect(new URL(routes.dashboard, nextUrl));
      }
      return true;
    },
    // Add user ID to the token and session
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
