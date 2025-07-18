"use client"

import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { UserSession, User } from "@prisma/client"
import { IconRefresh } from "@tabler/icons-react"

type UserSessionWithUser = UserSession & {
  user: Pick<User, "id" | "name" | "email" | "role">
}

export function UserSessionsTable() {
  const [data, setData] = useState<UserSessionWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/user-sessions?active=${showActiveOnly}`
      )
      const sessions = await res.json()
      setData(sessions)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [showActiveOnly])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active-only"
              checked={showActiveOnly}
              onCheckedChange={(checked) => setShowActiveOnly(!!checked)}
            />
            <label
              htmlFor="active-only"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show active sessions only
            </label>
          </div>
        </div>
        <Button
          onClick={fetchData}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <IconRefresh className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
      
      <div className="text-sm text-muted-foreground">
        Showing {data.length} session{data.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}