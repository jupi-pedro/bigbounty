"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { UserSession, User } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"

type UserSessionWithUser = UserSession & {
  user: Pick<User, "id" | "name" | "email" | "role">
}

export const columns: ColumnDef<UserSessionWithUser, unknown>[] = [
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "user.role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user.role
      return (
        <Badge variant="secondary" className="text-xs">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "userAgent",
    header: "Device/Browser",
    cell: ({ row }) => {
      const userAgent = row.getValue("userAgent") as string
      
      // Simple parsing to extract browser and OS info
      const getBrowserInfo = (ua: string) => {
        if (ua.includes("Chrome")) return "Chrome"
        if (ua.includes("Firefox")) return "Firefox"
        if (ua.includes("Safari")) return "Safari"
        if (ua.includes("Edge")) return "Edge"
        return "Unknown"
      }
      
      const getOSInfo = (ua: string) => {
        if (ua.includes("Windows")) return "Windows"
        if (ua.includes("Mac")) return "macOS"
        if (ua.includes("Linux")) return "Linux"
        if (ua.includes("Android")) return "Android"
        if (ua.includes("iOS")) return "iOS"
        return "Unknown"
      }
      
      const browser = getBrowserInfo(userAgent)
      const os = getOSInfo(userAgent)
      
      return (
        <div className="max-w-[200px] truncate" title={userAgent}>
          {browser} on {os}
        </div>
      )
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const lastActive = row.getValue("lastActive") as Date
      return (
        <span className="text-sm">
          {formatDistanceToNow(new Date(lastActive), { addSuffix: true })}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Started",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date
      return (
        <span className="text-sm">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      const expiresAt = new Date(row.original.expiresAt)
      const isExpired = expiresAt < new Date()
      
      if (!isActive || isExpired) {
        return <Badge variant="destructive">Inactive</Badge>
      }
      
      return <Badge variant="default">Active</Badge>
    },
  },
]