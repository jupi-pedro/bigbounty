"use server"

import { signIn, signOut, auth } from "@/lib/auth/auth"
import { AuthError } from "next-auth"
import { deactivateUserSession } from "@/lib/session-tracker"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error
  }
}

export async function signOutAction() {
  const session = await auth()
  
  if (session?.user?.id && session?.sessionId) {
    // Deactivate the current session
    await deactivateUserSession(session.user.id, session.sessionId)
  }
  
  await signOut({ redirectTo: "/" })
}
