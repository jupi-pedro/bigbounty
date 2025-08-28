"use client"

import { useEffect, useState, useCallback } from "react"
import { InterviewStep } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { IconPlus, IconPencil, IconTrash, IconCalendar, IconUser, IconBriefcase } from "@tabler/icons-react"
import Link from "next/link"

interface InterviewStepsListProps {
  interviewProcessId: string
}

export function InterviewStepsList({ interviewProcessId }: InterviewStepsListProps) {
  const [steps, setSteps] = useState<InterviewStep[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSteps = useCallback(async () => {
    try {
      const res = await fetch(`/api/interview-steps?interviewProcessId=${interviewProcessId}`)
      const data = await res.json()
      setSteps(data)
    } catch (error) {
      console.error("Failed to fetch interview steps:", error)
    } finally {
      setLoading(false)
    }
  }, [interviewProcessId])

  useEffect(() => {
    fetchSteps()
  }, [fetchSteps])

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this interview step?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/interview-steps/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchSteps()
      } else {
        alert("Failed to delete interview step.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete interview step.")
    }
  }


  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Assessment":
        return <IconBriefcase className="h-4 w-4" />
      case "Phone Call":
        return <IconUser className="h-4 w-4" />
      case "Video Call":
        return <IconUser className="h-4 w-4" />
      default:
        return <IconBriefcase className="h-4 w-4" />
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    // For date-only fields, we want to display the date regardless of timezone
    // Extract just the date parts to avoid timezone conversion
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      timeZone: "UTC", // Display the UTC date as-is since it represents a date, not a datetime
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading interview steps...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interview Steps</h3>
        <Link href={`/interview-steps/create?interviewProcessId=${interviewProcessId}`}>
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </Link>
      </div>

      {steps.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No interview steps yet</p>
          <Link href={`/interview-steps/create?interviewProcessId=${interviewProcessId}`}>
            <Button variant="outline" size="sm">
              <IconPlus className="mr-2 h-4 w-4" />
              Add First Step
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-center gap-2 mb-3">
                {getTypeIcon(step.type)}
                <span className="text-sm font-medium text-gray-600">{step.type}</span>
              </div>

              <h4 className="font-semibold mb-2 text-gray-900">{step.title}</h4>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4" />
                  <span>{formatDate(step.date)}</span>
                </div>
                
                {step.interviewerName && (
                  <div className="flex items-center gap-2">
                    <IconUser className="h-4 w-4" />
                    <span>{step.interviewerName}</span>
                  </div>
                )}

                {step.note && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{step.note}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Link href={`/interview-steps/edit/${step.id}?interviewProcessId=${interviewProcessId}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <IconPencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(step.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}