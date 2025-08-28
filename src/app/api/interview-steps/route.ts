import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Permission } from "@/lib/utils/permissions"
import { withApiPermission } from "@/lib/auth/with-api-permission"

export const GET = withApiPermission(
  Permission.ListInterviewSteps,
  async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const interviewProcessId = searchParams.get("interviewProcessId")

    if (!interviewProcessId) {
      return NextResponse.json(
        { error: "Interview Process ID is required" },
        { status: 400 }
      )
    }

    const data = await prisma.interviewStep.findMany({
      where: { interviewProcessId },
      orderBy: { date: "asc" },
    })

    return NextResponse.json(data)
  }
)