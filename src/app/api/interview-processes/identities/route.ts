import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Permission } from "@/lib/utils/permissions"
import { withApiPermission } from "@/lib/auth/with-api-permission"

export const GET = withApiPermission(
  Permission.ListInterviewProcesses,
  async () => {
    // Fetch all unique identities
    const interviewProcesses = await prisma.interviewProcess.findMany({
      select: {
        identity: true,
      },
      distinct: ['identity'],
      orderBy: {
        identity: 'asc',
      },
    })

    // Group case-insensitively and keep the first occurrence's casing
    const uniqueIdentitiesMap = new Map<string, string>()
    interviewProcesses.forEach(process => {
      const normalizedIdentity = process.identity.toLowerCase()
      if (!uniqueIdentitiesMap.has(normalizedIdentity)) {
        uniqueIdentitiesMap.set(normalizedIdentity, process.identity)
      }
    })

    const identities = Array.from(uniqueIdentitiesMap.values()).sort()

    return NextResponse.json(identities)
  }
)
