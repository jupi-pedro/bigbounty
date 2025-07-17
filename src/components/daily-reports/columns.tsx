"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DailyReport, User } from "@prisma/client"
import Link from "next/link"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { hasPermission, Permission } from "@/lib/utils/permissions"

type DailyReportWithUser = DailyReport & {
  user: { name: string }
}

export const columns = (currentUser: User): ColumnDef<DailyReportWithUser>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const dateStr: string = row.getValue("date")
      return dateStr.slice(0, 10)
    },
  },
  {
    accessorKey: "user.name",
    header: "User",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const report = row.original

      // Check if user can edit/delete this report
      const canEdit = hasPermission(currentUser.role, Permission.ManageOtherDailyReports) ||
                     report.userId === currentUser.id

      const handleDelete = async () => {
        const confirmed = confirm(
          "Are you sure you want to delete this daily report?"
        )
        if (!confirmed) return

        const res = await fetch(`/api/daily-reports/${report.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          window.location.reload()
        } else {
          const data = await res.json()
          alert(data.error || "Failed to delete daily report.")
        }
      }

      if (!canEdit) return null

      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/daily-reports/edit/${report.id}`}>
            <Button variant="outline" size="icon">
              <IconPencil />
            </Button>
          </Link>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <IconTrash />
          </Button>
        </div>
      )
    },
  },
]
