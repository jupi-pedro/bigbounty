"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "company.name",
    header: "Company",
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link: string = row.getValue("link")
      return (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block max-w-[500px] truncate text-blue-600 underline"
        >
          {link}
        </Link>
      )
    },
  },
  {
    accessorKey: "user.name",
    header: "Creator",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const jobLink = row.original

      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/job-links/edit/${jobLink.id}`}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <form action={`/api/job-links/delete/${jobLink.id}`} method="post">
            <Button
              type="submit"
              variant="destructive"
              size="icon"
              onClick={(e) => {
                if (
                  !confirm("Are you sure you want to delete this job link?")
                ) {
                  e.preventDefault()
                }
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )
    },
  },
]
