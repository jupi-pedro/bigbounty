"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { User } from "@prisma/client"

interface Props {
  users: User[]
}

export function UsersTable({ users }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/users/create">
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
