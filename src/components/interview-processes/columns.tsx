"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { InterviewProcess } from "@prisma/client"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const columns: ColumnDef<InterviewProcess>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => {
      return <div className="w-8">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => {
      const jobTitle: string = row.getValue("jobTitle")
      return (
        <div className="max-w-[200px] truncate" title={jobTitle}>
          {jobTitle}
        </div>
      )
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company: string = row.getValue("company")
      return (
        <div className="max-w-[150px] truncate" title={company}>
          {company}
        </div>
      )
    },
  },
  {
    accessorKey: "identity",
    header: "Identity",
    cell: ({ row }) => {
      const identity: string = row.getValue("identity")
      return (
        <div className="max-w-[150px] truncate" title={identity}>
          {identity}
        </div>
      )
    },
  },
  {
    accessorKey: "person",
    header: "Person",
    cell: ({ row }) => {
      const person: string = row.getValue("person")
      return (
        <div className="max-w-[150px] truncate" title={person}>
          {person}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status")
      
      const getStatusColor = (status: string) => {
        switch (status) {
          case "In Progress":
            return "bg-blue-100 text-blue-800 border-blue-200"
          case "Offered":
            return "bg-green-100 text-green-800 border-green-200"
          case "Declined":
            return "bg-red-100 text-red-800 border-red-200"
          default:
            return "bg-gray-100 text-gray-800 border-gray-200"
        }
      }

      return (
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full border",
            getStatusColor(status)
          )}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "interviewSteps",
    header: "Steps",
    cell: ({ row }) => {
      const steps = row.getValue("interviewSteps") as Array<{
        id: string;
        date: string | Date;
        type: string;
        title: string;
      }>
      
      if (!steps || steps.length === 0) {
        return (
          <div className="text-gray-400 text-sm">
            No steps
          </div>
        )
      }

      const getTimeSinceLastStep = () => {
        const sortedSteps = [...steps].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        
        const lastStep = sortedSteps[0]
        const lastStepDateStr = String(lastStep.date)
        
        // Simple string-based comparison for YYYY-MM-DD dates
        const today = new Date()
        const todayStr = today.getFullYear() + '-' + 
                        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(today.getDate()).padStart(2, '0')
        
        // Extract just the date part if it includes time
        const lastDateOnly = lastStepDateStr.split('T')[0]
        
        if (lastDateOnly === todayStr) {
          return "today"
        }
        
        // For other cases, calculate the difference
        const lastDate = new Date(lastDateOnly + 'T12:00:00')  // Use noon to avoid timezone issues
        const todayDate = new Date(todayStr + 'T12:00:00')
        
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          return "yesterday"
        } else if (diffDays < 7) {
          return `${diffDays} days ago`
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7)
          return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
        } else {
          const months = Math.floor(diffDays / 30)
          return months === 1 ? "1 month ago" : `${months} months ago`
        }
      }

      return (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </div>
          <div className="text-gray-500">
            {getTimeSinceLastStep()}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const interviewProcess = row.original

      const handleDelete = async () => {
        const confirmed = confirm(
          "Are you sure you want to delete this interview process?"
        )
        if (!confirmed) return

        const res = await fetch(`/api/interview-processes/${interviewProcess.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          window.location.reload()
        } else {
          alert("Failed to delete interview process.")
        }
      }

      return (
        <div className="flex gap-2 justify-end">
          <Link href={`/interview-processes/edit/${interviewProcess.id}`}>
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