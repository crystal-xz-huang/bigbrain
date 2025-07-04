import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // avoid running middleware on API routes, static files, and images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
