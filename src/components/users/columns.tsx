"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client"
import Link from "next/link"
import { IconPencil, IconTrash } from "@tabler/icons-react"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt")
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original

      const handleDelete = async () => {
        const confirmed = confirm("Are you sure you want to delete this user?")
        if (!confirmed) return

        const res = await fetch(`/api/users/${user.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          window.location.reload()
        } else {
          const data = await res.json()
          alert(data.error || "Failed to delete user.")
        }
      }

      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/users/edit/${user.id}`}>
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
