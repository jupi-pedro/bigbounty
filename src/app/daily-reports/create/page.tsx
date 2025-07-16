import { CreateDailyReportForm } from "@/components/daily-reports/create-daily-report-form"

export default function CreateJobLinkPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Daily Report</h1>

      <CreateDailyReportForm />
    </div>
  )
}
