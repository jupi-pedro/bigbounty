"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createDailyReport } from "@/lib/actions/daily-reports"
import {
  DailyReportForm,
  DailyReportFormData,
} from "@/components/daily-reports/daily-report-form"
import { useState } from "react"

export function CreateDailyReportForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (values: DailyReportFormData) => {
    setIsPending(true)

    const formData = new FormData()
    formData.set("date", values.date.toISOString().split("T")[0])
    formData.set("content", values.content)

    const result = await createDailyReport(undefined, formData)
    setIsPending(false)

    if (result?.success) {
      toast.success("Daily report submitted")
      router.push("/daily-reports")
    } else {
      toast.error(result?.message || "Failed to submit")
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DailyReportForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  )
}
