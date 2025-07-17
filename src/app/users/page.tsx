import { prisma } from "@/lib/prisma"
import { UsersTable } from "@/components/users/users-table"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Users</h2>
      <UsersTable users={users} />
    </div>
  )
}
