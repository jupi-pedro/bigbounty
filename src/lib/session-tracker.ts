"use server"

import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function trackUserSession(userId: string, sessionId: string) {
  const headersList = await headers()
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown"
  const userAgent = headersList.get("user-agent") || "unknown"

  // Clean up IP address (take first IP if multiple)
  const cleanIpAddress = ipAddress.split(",")[0].trim()

  // Set session to expire in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  // Check if there's an existing session with this sessionId
  const existingSession = await prisma.userSession.findUnique({
    where: {
      sessionId,
    },
  })

  if (existingSession) {
    // Update existing session (including potentially new IP address)
    await prisma.userSession.update({
      where: { sessionId },
      data: {
        ipAddress: cleanIpAddress,
        userAgent,
        lastActive: new Date(),
        expiresAt,
      },
    })
  } else {
    // Create new session
    await prisma.userSession.create({
      data: {
        sessionId,
        userId,
        ipAddress: cleanIpAddress,
        userAgent,
        lastActive: new Date(),
        expiresAt,
        isActive: true,
      },
    })
  }
}

export async function deactivateUserSession(
  userId: string,
  sessionId?: string
) {
  if (sessionId) {
    // Deactivate specific session by sessionId
    await prisma.userSession.updateMany({
      where: { 
        sessionId,
        userId 
      },
      data: { isActive: false },
    })
  } else {
    // Deactivate all sessions for the user
    await prisma.userSession.updateMany({
      where: { userId },
      data: { isActive: false },
    })
  }
}

export async function cleanupExpiredSessions() {
  await prisma.userSession.updateMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
    data: {
      isActive: false,
    },
  })
}
