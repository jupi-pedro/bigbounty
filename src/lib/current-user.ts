import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { cache } from "react"

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return user
})
