import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

let cachedUser: User | null = null

export async function getCurrentUser() {
  if (cachedUser) return cachedUser

  const session = await auth()
  if (!session?.user?.id) return null

  cachedUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return cachedUser
}
