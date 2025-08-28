import { InterviewProcessesTable } from "@/components/interview-processes/interview-processes-table"

export default async function InterviewProcessesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Interview Processes</h2>
      <InterviewProcessesTable />
    </div>
  )
}