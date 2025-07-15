import { DataTable } from "@/components/shared/data-table"
import { prisma } from "@/lib/prisma"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"

export default async function JobLinksPage() {
  const jobLinks = await prisma.jobLink.findMany({
    include: { company: true, user: true },
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Job Links</h2>
        <Link href="/job-links/create">
          <Button>
            <IconPlus /> Create Job Link
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={jobLinks} pageSize={10} />
    </div>
  )
}
