export { auth as middleware } from "@/auth"

export const config = {
  // avoid running middleware on API routes, static files, and images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}