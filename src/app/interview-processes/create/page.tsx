import { InterviewProcessForm } from "@/components/interview-processes/interview-process-form"

export default function CreateInterviewProcessPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Interview Process</h1>
      <InterviewProcessForm mode="create" />
    </div>
  )
}