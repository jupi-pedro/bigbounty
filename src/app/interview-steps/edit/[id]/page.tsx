import { InterviewStepForm } from "@/components/interview-steps/interview-step-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface EditInterviewStepPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ interviewProcessId?: string }>
}

export default async function EditInterviewStepPage({ params, searchParams }: EditInterviewStepPageProps) {
  const { id } = await params
  const searchParamsResolved = await searchParams
  const interviewProcessId = searchParamsResolved.interviewProcessId
  
  const interviewStep = await prisma.interviewStep.findUnique({
    where: { id },
  })

  if (!interviewStep || !interviewProcessId) {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Interview Step</h1>
      <InterviewStepForm 
        mode="edit" 
        interviewStep={interviewStep} 
        interviewProcessId={interviewProcessId}
      />
    </div>
  )
}