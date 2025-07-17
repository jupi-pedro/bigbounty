import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { withApiPermission } from "@/lib/auth/with-api-permission"
import { Permission, hasPermission } from "@/lib/utils/permissions"
import { getCurrentUser } from "@/lib/current-user"

export const GET = withApiPermission(
  Permission.ListDailyReports,
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const date = searchParams.get("date")
    const userId = searchParams.get("userId")

    const currentUser = await getCurrentUser()
    const where: Prisma.DailyReportWhereInput = {}

    // Check if user can manage other users' reports
    if (
      currentUser &&
      !hasPermission(currentUser.role, Permission.ManageOtherDailyReports)
    ) {
      // If not, only show their own reports
      where.userId = currentUser.id
    } else if (userId) {
      // If they can manage others, allow filtering by userId
      where.userId = userId
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`)
      const end = new Date(`${date}T23:59:59.999Z`)
      where.date = {
        gte: start,
        lte: end,
      }
    }

    const [data, total] = await Promise.all([
      prisma.dailyReport.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { user: true },
        orderBy: { date: "desc" },
      }),
      prisma.dailyReport.count({ where }),
    ])

    return NextResponse.json({ data, total })
  }
)
