import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const date = searchParams.get("date")

  let dateFilter = {}

  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`)
    const end = new Date(`${date}T23:59:59.999Z`)
    dateFilter = {
      createdAt: {
        gte: start,
        lte: end,
      },
    }
  }

  const [data, total] = await Promise.all([
    prisma.jobLink.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: dateFilter,
      include: { company: true, user: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.jobLink.count({ where: dateFilter }),
  ])

  return NextResponse.json({ data, total })
}
