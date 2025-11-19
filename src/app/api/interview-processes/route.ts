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
    const statusFilter = searchParams.get("status")
    const identityFilter = searchParams.get("identity")

    const where: Prisma.InterviewProcessWhereInput = {}
    const andConditions: Prisma.InterviewProcessWhereInput[] = []

    if (searchQuery) {
      andConditions.push({
        OR: [
          { jobTitle: { contains: searchQuery, mode: "insensitive" } },
          { company: { contains: searchQuery, mode: "insensitive" } },
          { identity: { contains: searchQuery, mode: "insensitive" } },
          { person: { contains: searchQuery, mode: "insensitive" } }
        ]
      })
    }

    if (statusFilter) {
      andConditions.push({ status: statusFilter })
    }

    if (identityFilter) {
      // Support multiple identities separated by comma
      const identities = identityFilter.split(',').map(i => i.trim()).filter(Boolean)
      if (identities.length > 0) {
        andConditions.push({
          OR: identities.map(identity => ({
            identity: { equals: identity, mode: "insensitive" as Prisma.QueryMode }
          }))
        })
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // First get all matching records with their interview steps
    const [allData, total] = await Promise.all([
      prisma.interviewProcess.findMany({
        where,
        include: {
          interviewSteps: {
            orderBy: { date: "asc" },
          },
        },
      }),
      prisma.interviewProcess.count({ where }),
    ])

    // Sort by latest interview step date (descending)
    const sortedData = allData.sort((a, b) => {
      // Get the latest step date for each process
      const aLatestStep = a.interviewSteps.length > 0
        ? new Date(a.interviewSteps[a.interviewSteps.length - 1].date).getTime()
        : 0 // Processes without steps go to the bottom

      const bLatestStep = b.interviewSteps.length > 0
        ? new Date(b.interviewSteps[b.interviewSteps.length - 1].date).getTime()
        : 0 // Processes without steps go to the bottom

      // Primary sort by latest step date
      if (aLatestStep !== bLatestStep) {
        return bLatestStep - aLatestStep // Descending order
      }

      // Secondary sort by createdAt for stable ordering
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    // Apply pagination after sorting
    const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({ data: paginatedData, total })
  }
)