import type { NextAuthConfig } from "next-auth"

const PUBLIC_ROUTES = ["/login", "/register", "/favicon.ico"]

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user

      const isPublic = PUBLIC_ROUTES.some((path) =>
        nextUrl.pathname.startsWith(path)
      )

      if (!isPublic) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
