"use client"

import { useEffect, useState, useRef } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { InterviewProcess } from "@prisma/client"
import { Input } from "@/components/ui/input"

export function InterviewProcessesTable() {
  const [data, setData] = useState<InterviewProcess[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pageSize = 50

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/interview-processes?page=${page}&pageSize=${pageSize}${
          searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
        }`
      )
      const json = await res.json()
      setData(json.data)
      setTotal(json.total)
    }

    fetchData()
  }, [page, searchQuery])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex gap-2 flex-col sm:flex-row items-center">
          <Input
            type="text"
            placeholder="Search job title, company, identity, or person..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-96"
          />
        </div>
        <Link href="/interview-processes/create">
          <Button size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Interview Process
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