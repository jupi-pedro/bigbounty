import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/auth"
import { trackUserSession } from "@/lib/session-tracker"

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !session?.sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await trackUserSession(session.user.id, session.sessionId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to track session:", error)
    return NextResponse.json({ error: "Failed to track session" }, { status: 500 })
  }
}