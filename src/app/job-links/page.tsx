import { prisma } from "@/lib/prisma"
import { JobLinksTable } from "@/components/job-links/job-links-table"

export default async function JobLinksPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Job Links</h2>
      <JobLinksTable users={users} />
    </div>
  )
}
