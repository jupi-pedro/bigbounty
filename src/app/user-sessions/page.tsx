import { UserSessionsTable } from "@/components/user-sessions/user-sessions-table"

export default async function UserSessionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">User Sessions</h1>
        <p className="text-muted-foreground">
          Monitor active user sessions and connection details
        </p>
      </div>

      <UserSessionsTable />
    </div>
  )
}
