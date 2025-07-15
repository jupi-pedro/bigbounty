import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: "Administrator" | "Moderator" | "Viewer" | "Developer"
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "Administrator" | "Moderator" | "Viewer" | "Developer"
    }
  }
}
