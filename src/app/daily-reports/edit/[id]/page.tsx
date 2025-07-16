import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditDailyReportForm } from "@/components/daily-reports/edit-daily-report-form"

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

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Daily Report</h1>
      <EditDailyReportForm dailyReport={dailyReport} />
    </div>
  )
}
