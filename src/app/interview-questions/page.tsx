import { prisma } from "@/lib/prisma"
import { JobLinksTable } from "@/components/job-links/job-links-table"

export default async function JobLinksPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Interview Questions</h2>
      <div>Coming soon</div>
    </div>
  )
}
