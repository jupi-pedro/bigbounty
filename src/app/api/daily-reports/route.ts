import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const date = searchParams.get("date")
  const userId = searchParams.get("userId")

  const where: Prisma.DailyReportWhereInput = {}

  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`)
    const end = new Date(`${date}T23:59:59.999Z`)
    where.date = {
      gte: start,
      lte: end,
    }
  }

  if (userId) {
    where.userId = userId
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
