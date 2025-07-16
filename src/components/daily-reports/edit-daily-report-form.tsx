"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { editDailyReport } from "@/lib/actions/daily-reports"
import {
  DailyReportForm,
  DailyReportFormData,
} from "@/components/daily-reports/daily-report-form"
import { useState } from "react"
import { DailyReport } from "@prisma/client"

interface EditDailyReportFormProps {
  dailyReport: DailyReport
}

export function EditDailyReportForm({ dailyReport }: EditDailyReportFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (values: DailyReportFormData) => {
    setIsPending(true)

    const formData = new FormData()
    formData.set("id", dailyReport.id)
    formData.set("date", values.date.toISOString().split("T")[0])
    formData.set("content", values.content)

    const result = await editDailyReport(undefined, formData)
    setIsPending(false)

    if (result?.success) {
      toast.success("Daily report updated")
      router.push("/daily-reports")
    } else {
      toast.error(result?.message || "Failed to update")
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DailyReportForm
        onSubmit={handleSubmit}
        isPending={isPending}
        defaultValues={{
          date: new Date(
            new Date(dailyReport.date).getUTCFullYear(),
            new Date(dailyReport.date).getUTCMonth(),
            new Date(dailyReport.date).getUTCDate()
          ),
          content: dailyReport.content,
        }}
      />
    </div>
  )
}
