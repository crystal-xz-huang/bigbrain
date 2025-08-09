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
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/play') || nextUrl.pathname.startsWith('/user');
      const isAuthRoute = nextUrl.pathname.startsWith('/auth');

      // Protect '/admin' routes
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false;
      }

      // Redirect logged-in users from auth routes to the dashboard
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL(routes.dashboard, nextUrl));
      }

      // Allow access to all other routes
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
