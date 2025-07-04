import type { NextAuthConfig } from 'next-auth';
// providers
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import type { Provider } from 'next-auth/providers';

// Edge-compatible configuration object for NextAuth.js

const providers: Provider[] = [
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


export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Redirect unauthenticated users to the login page,
      // otherwise allow access to the /dashboard page.
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
