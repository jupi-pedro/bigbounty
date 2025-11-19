"use client"

import { useEffect, useState, useRef } from "react"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconPlus, IconChevronDown } from "@tabler/icons-react"
import { InterviewProcess, InterviewStep } from "@prisma/client"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { interviewProcessStatuses } from "@/lib/constants/interview-step"

type InterviewProcessWithSteps = InterviewProcess & {
  interviewSteps: InterviewStep[]
}

export function InterviewProcessesTable() {
  const [data, setData] = useState<InterviewProcessWithSteps[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("In Progress")
  const [identityFilter, setIdentityFilter] = useState<string[]>([])
  const [availableIdentities, setAvailableIdentities] = useState<string[]>([])
  const [identityPopoverOpen, setIdentityPopoverOpen] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pageSize = 50

  useEffect(() => {
    const fetchIdentities = async () => {
      const res = await fetch('/api/interview-processes/identities')
      if (res.ok) {
        const identities = await res.json()
        setAvailableIdentities(identities)
      }
    }

    fetchIdentities()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const identityParam = identityFilter.length > 0
        ? `&identity=${identityFilter.map(encodeURIComponent).join(',')}`
        : ""

      const res = await fetch(
        `/api/interview-processes?page=${page}&pageSize=${pageSize}${
          searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
        }${statusFilter && statusFilter !== "all" ? `&status=${encodeURIComponent(statusFilter)}` : ""}${identityParam}`
      )
      const json = await res.json()
      setData(json.data)
      setTotal(json.total)
    }

    fetchData()
  }, [page, searchQuery, statusFilter, identityFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter, identityFilter])

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

  const handleIdentityToggle = (identity: string) => {
    setIdentityFilter(prev =>
      prev.includes(identity)
        ? prev.filter(i => i !== identity)
        : [...prev, identity]
    )
  }

  const clearIdentityFilter = () => {
    setIdentityFilter([])
  }

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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {interviewProcessStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover open={identityPopoverOpen} onOpenChange={setIdentityPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                {identityFilter.length > 0
                  ? `${identityFilter.length} ${identityFilter.length === 1 ? 'Identity' : 'Identities'}`
                  : 'Filter by identity'}
                <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="max-h-64 overflow-auto p-2">
                {availableIdentities.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No identities found
                  </div>
                ) : (
                  <>
                    {identityFilter.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start mb-1"
                        onClick={clearIdentityFilter}
                      >
                        Clear selection
                      </Button>
                    )}
                    {availableIdentities.map((identity) => (
                      <div
                        key={identity}
                        className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                        onClick={() => handleIdentityToggle(identity)}
                      >
                        <Checkbox
                          checked={identityFilter.includes(identity)}
                          onCheckedChange={() => handleIdentityToggle(identity)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {identity}
                        </label>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
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