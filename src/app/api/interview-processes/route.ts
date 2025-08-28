import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { Permission } from "@/lib/utils/permissions"
import { withApiPermission } from "@/lib/auth/with-api-permission"

export const GET = withApiPermission(
  Permission.ListInterviewProcesses,
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const searchQuery = searchParams.get("search")

    const where: Prisma.InterviewProcessWhereInput = {}

    if (searchQuery) {
      where.OR = [
        { jobTitle: { contains: searchQuery, mode: "insensitive" } },
        { company: { contains: searchQuery, mode: "insensitive" } },
        { identity: { contains: searchQuery, mode: "insensitive" } },
        { person: { contains: searchQuery, mode: "insensitive" } }
      ]
    }

    const [data, total] = await Promise.all([
      prisma.interviewProcess.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: {
          interviewSteps: {
            orderBy: { date: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.interviewProcess.count({ where }),
    ])

    return NextResponse.json({ data, total })
  }
)