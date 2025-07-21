import { Role } from "@prisma/client"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "../prisma"

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
    async jwt({ token, trigger }) {
      // Generate sessionId on sign in
      if (trigger === "signIn" && !token.sessionId) {
        token.sessionId = crypto.randomUUID()
      }
      
      if (!token.role && token.sub) {
        const userInDb = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        })
        token.role = userInDb?.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub
        session.user.role = token.role as Role
      }
      if (token?.sessionId) {
        session.sessionId = token.sessionId as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
