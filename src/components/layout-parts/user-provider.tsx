"use client"

import { ReactNode } from "react"
import { User } from "@prisma/client"
import { UserContext } from "@/lib/contexts/user-context"

export function UserProvider({
  user,
  children,
}: {
  user: User
  children: ReactNode
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
