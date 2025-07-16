"use client"

import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/shared/date-picker"
import { UserSelect } from "@/components/shared/user-select"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { DailyReport } from "@prisma/client"

interface User {
  id: string
  name: string
}

interface Props {
  users: User[]
  currentUserId?: string
}

export function DailyReportsTable({ users, currentUserId }: Props) {
  const [data, setData] = useState<DailyReport[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => new Date()
  )
  const [userId, setUserId] = useState<string | undefined>(() => currentUserId)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      const dateParam = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined

      const res = await fetch(
        `/api/daily-reports?page=${page}&pageSize=${pageSize}${
          dateParam ? `&date=${dateParam}` : ""
        }${userId ? `&userId=${userId}` : ""}`
      )
      const json = await res.json()
      setData(json.data)
      setTotal(json.total)
    }

    fetchData()
  }, [page, selectedDate, userId])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex gap-2 flex-col sm:flex-row">
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
          <UserSelect users={users} userId={userId} setUserId={setUserId} />
        </div>
        <Link href="/daily-reports/create">
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Daily Report
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={data} />

      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((page - 1) * pageSize + 1, total)}–
          {Math.min(page * pageSize, total)} of {total} results
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * pageSize >= total}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
