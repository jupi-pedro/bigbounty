"use client"

import { createContext, useContext } from "react"
import { User } from "@prisma/client"

export const UserContext = createContext<User | null>(null)

export function useCurrentUser() {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error("useCurrentUser must be used within a UserProvider")
  }
  return user
}
