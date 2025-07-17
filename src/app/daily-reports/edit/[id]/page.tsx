import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditDailyReportForm } from "@/components/daily-reports/edit-daily-report-form"
import { getCurrentUser } from "@/lib/current-user"
import { hasPermission, Permission } from "@/lib/utils/permissions"
import { Forbidden } from "@/components/forbidden"

export default async function EditDailyReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const dailyReport = await prisma.dailyReport.findUnique({
    where: { id },
  })

  if (!dailyReport) {
    return notFound()
  }

  const currentUser = await getCurrentUser()
  
  // Check if user can edit this report
  const canEdit = currentUser && (
    hasPermission(currentUser.role, Permission.ManageOtherDailyReports) ||
    dailyReport.userId === currentUser.id
  )

  if (!canEdit) {
    return <Forbidden />
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Daily Report</h1>
      <EditDailyReportForm dailyReport={dailyReport} />
    </div>
  )
}
