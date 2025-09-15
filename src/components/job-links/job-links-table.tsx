"use client"

import { useEffect, useState, useRef } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/shared/date-picker"
import { UserSelect } from "@/components/shared/user-select"
import Link from "next/link"
import { IconPlus, IconDownload } from "@tabler/icons-react"
import { JobLink, Role } from "@prisma/client"
import { useCurrentUser } from "@/lib/contexts/user-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
}

interface JobLinkWithRelations extends JobLink {
  company?: { name: string } | null
  jobLinkSource?: { name: string } | null
  user?: { name: string } | null
}

interface Props {
  users: User[]
}

export function JobLinksTable({ users }: Props) {
  const currentUser = useCurrentUser()
  const [data, setData] = useState<JobLinkWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    () => new Date()
  )
  const [userId, setUserId] = useState<string | undefined>()
  const [avoidDuplicates, setAvoidDuplicates] = useState(
    currentUser.role === Role.Viewer
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      const dateParam = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined

      const res = await fetch(
        `/api/job-links?page=${page}&pageSize=${pageSize}${
          dateParam ? `&date=${dateParam}` : ""
        }${userId ? `&userId=${userId}` : ""}${
          avoidDuplicates ? "&avoidDuplicates=true" : ""
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
      )
      const json = await res.json()
      setData(json.data)
      setTotal(json.total)
    }

    fetchData()
  }, [page, selectedDate, userId, avoidDuplicates, searchQuery])

  useEffect(() => {
    setUserId(currentUser.role === Role.Developer ? currentUser.id : undefined)
    setAvoidDuplicates(currentUser.role === Role.Viewer)
  }, [currentUser])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchInput])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const dateParam = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined

      const res = await fetch(
        `/api/job-links?page=1&pageSize=${total || 1000}${
          dateParam ? `&date=${dateParam}` : ""
        }${userId ? `&userId=${userId}` : ""}${
          avoidDuplicates ? "&avoidDuplicates=true" : ""
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
      )
      const json = await res.json()
      const allData = json.data

      const csvContent = convertToCSV(allData)
      downloadCSV(csvContent, `job-links-${new Date().toISOString().split("T")[0]}.csv`)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: JobLinkWithRelations[]) => {
    const headers = ["#", "Job Title", "Company", "Source", "Link", "Created At"]

    const rows = data.map((item, index) => {
      const createdAt = new Date(item.createdAt)
      const formattedDate = createdAt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).replace(",", "")

      return [
        index + 1,
        `"${(item.jobTitle || "").replace(/"/g, '""')}"`,
        `"${(item.company?.name || "").replace(/"/g, '""')}"`,
        `"${(item.jobLinkSource?.name || "").replace(/"/g, '""')}"`,
        `"${(item.link || "").replace(/"/g, '""')}"`,
        `"${formattedDate}"`
      ].join(",")
    })

    return [headers.join(","), ...rows].join("\n")
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <DatePicker date={selectedDate} setDate={setSelectedDate} />
          <UserSelect users={users} userId={userId} setUserId={setUserId} />
          <Input
            type="text"
            placeholder="Search job title or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avoid-duplicates"
              checked={avoidDuplicates}
              onCheckedChange={(checked) => setAvoidDuplicates(!!checked)}
            />
            <label
              htmlFor="avoid-duplicates"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hide duplicate jobs
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || total === 0}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Link href="/job-links/create">
            <Button size="sm">
              <IconPlus className="mr-2 h-4 w-4" />
              Create Job Link
            </Button>
          </Link>
        </div>
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
