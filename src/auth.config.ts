import type { NextAuthConfig } from 'next-auth';
import GitHub from "next-auth/providers/github"

export default {
  // pages: {
  //   signIn: '/login',
  // },
  providers: [GitHub],
} satisfies NextAuthConfig;
