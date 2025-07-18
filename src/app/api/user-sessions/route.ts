import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Permission } from "@/lib/utils/permissions"
import { withApiPermission } from "@/lib/auth/with-api-permission"

export const GET = withApiPermission(
  Permission.ListUsers, // Using ListUsers permission for now
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const showActiveOnly = searchParams.get("active") === "true"

    const where = showActiveOnly
      ? {
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        }
      : {}

    const sessions = await prisma.userSession.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        lastActive: "desc",
      },
    })

    return NextResponse.json(sessions)
  }
)