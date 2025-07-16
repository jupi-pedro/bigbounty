import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"

export const GET = withApiPermission(
  Permission.ListJobLinks,
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""

    const companies = await prisma.company.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
      },
      take: 10,
    })

    return NextResponse.json(companies.map((c) => c.name))
  }
)
