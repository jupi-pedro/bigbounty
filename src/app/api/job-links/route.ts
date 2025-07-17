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
    const avoidDuplicates = searchParams.get("avoidDuplicates") === "true"

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

    let data, total

    if (avoidDuplicates) {
      // Get all job links with company info
      const allJobLinks = await prisma.jobLink.findMany({
        where,
        include: { company: true, user: true, jobLinkSource: true },
        orderBy: { createdAt: "asc" },
      })

      // Group by normalized job title and company name to avoid duplicates
      const uniqueJobs = new Map<string, typeof allJobLinks[0]>()
      
      allJobLinks.forEach(job => {
        const key = `${job.jobTitle.trim().toLowerCase()}_${job.company.name.trim().toLowerCase()}`
        if (!uniqueJobs.has(key)) {
          uniqueJobs.set(key, job)
        }
      })

      // Convert back to array and paginate
      const uniqueJobsArray = Array.from(uniqueJobs.values())
      total = uniqueJobsArray.length
      data = uniqueJobsArray.slice((page - 1) * pageSize, page * pageSize)
    } else {
      [data, total] = await Promise.all([
        prisma.jobLink.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          include: { company: true, user: true, jobLinkSource: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.jobLink.count({ where }),
      ])
    }

    return NextResponse.json({ data, total })
  }
)
