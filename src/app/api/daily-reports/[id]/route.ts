import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission, hasPermission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/current-user"

export const DELETE = withApiPermission(
  Permission.DeleteDailyReport,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing daily report ID" },
        { status: 400 }
      )
    }

    try {
      const currentUser = await getCurrentUser()
      
      // Check if the report exists and get the owner
      const report = await prisma.dailyReport.findUnique({
        where: { id },
      })

      if (!report) {
        return NextResponse.json(
          { error: "Daily report not found" },
          { status: 404 }
        )
      }

      // Check if user can only delete their own reports
      if (currentUser && !hasPermission(currentUser.role, Permission.ManageOtherDailyReports) && report.userId !== currentUser.id) {
        return NextResponse.json(
          { error: "You can only delete your own reports" },
          { status: 403 }
        )
      }

      await prisma.dailyReport.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete daily report" },
        { status: 500 }
      )
    }
  }
)
