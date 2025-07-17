import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { Permission } from "@/lib/utils/permissions"
import { withApiPermission } from "@/lib/auth/with-api-permission"

export const GET = withApiPermission(
  Permission.ListJobLinks,
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const date = searchParams.get("date")
    const userId = searchParams.get("userId")

    const where: Prisma.JobLinkWhereInput = {}

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`)
      const end = new Date(`${date}T23:59:59.999Z`)
      where.createdAt = {
        gte: start,
        lte: end,
      }
    }

    if (userId) {
      where.userId = userId
    }

    const [data, total] = await Promise.all([
      prisma.jobLink.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: { company: true, user: true, jobLinkSource: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.jobLink.count({ where }),
    ])

    return NextResponse.json({ data, total })
  }
)
