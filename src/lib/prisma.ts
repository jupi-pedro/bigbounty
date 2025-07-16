import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?statement_cache=false",
    },
  },
})

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
