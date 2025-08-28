import { InterviewStepForm } from "@/components/interview-steps/interview-step-form"
import { notFound } from "next/navigation"

interface CreateInterviewStepPageProps {
  searchParams: Promise<{ interviewProcessId?: string }>
}

export default async function CreateInterviewStepPage({ searchParams }: CreateInterviewStepPageProps) {
  const params = await searchParams
  const interviewProcessId = params.interviewProcessId

  if (!interviewProcessId) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Interview Step</h1>
      <InterviewStepForm mode="create" interviewProcessId={interviewProcessId} />
    </div>
  )
}