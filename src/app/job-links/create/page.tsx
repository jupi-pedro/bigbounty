import { CreateJobLinkForm } from "@/components/job-links/create-job-link-form"

export default function CreateJobLinkPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create Job Link</h1>

      <CreateJobLinkForm />
    </div>
  )
}
