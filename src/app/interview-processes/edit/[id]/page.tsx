import { InterviewProcessForm } from "@/components/interview-processes/interview-process-form"
import { InterviewStepsList } from "@/components/interview-steps/interview-steps-list"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface EditInterviewProcessPageProps {
  params: Promise<{ id: string }>
}

export default async function EditInterviewProcessPage({ params }: EditInterviewProcessPageProps) {
  const { id } = await params
  
  const interviewProcess = await prisma.interviewProcess.findUnique({
    where: { id },
  })

  if (!interviewProcess) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Interview Process</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Interview Process Form */}
        <div>
          <InterviewProcessForm mode="edit" interviewProcess={interviewProcess} />
        </div>
        
        {/* Right column - Interview Steps */}
        <div>
          <InterviewStepsList interviewProcessId={id} />
        </div>
      </div>
    </div>
  )
}