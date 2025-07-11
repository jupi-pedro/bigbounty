import type { User as PrismaUser } from "@prisma/client"

export type AppUser = Pick<
  PrismaUser,
  "id" | "email" | "emailVerified" | "name"
>
