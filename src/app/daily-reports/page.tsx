import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { DailyReportsTable } from "@/components/daily-reports/daily-reports-table"

export default async function DailyReportsPage() {
  const session = await auth()
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Daily Reports</h2>
      <DailyReportsTable users={users} currentUserId={session?.user?.id} />
    </div>
  )
}
