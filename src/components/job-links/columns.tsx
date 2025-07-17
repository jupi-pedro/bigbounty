"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobLink } from "@prisma/client"
import { IconTrash } from "@tabler/icons-react"

export const columns: ColumnDef<JobLink>[] = [
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "company.name",
    header: "Company",
  },
  {
    accessorKey: "jobLinkSource.name",
    header: "Source",
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
          className="inline-block max-w-[500px] truncate text-blue-600 visited:text-purple-600"
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

      const handleDelete = async () => {
        const confirmed = confirm(
          "Are you sure you want to delete this job link?"
        )
        if (!confirmed) return

        const res = await fetch(`/api/job-links/${jobLink.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          window.location.reload()
        } else {
          alert("Failed to delete job link.")
        }
      }

      return (
        <div className="flex gap-2 justify-end">
          {/* <Link href={`/job-links/edit/${jobLink.id}`}>
            <Button variant="outline" size="icon">
              <Pencil />
            </Button>
          </Link> */}
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <IconTrash />
          </Button>
        </div>
      )
    },
  },
]
