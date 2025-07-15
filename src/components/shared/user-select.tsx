"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface User {
  id: string
  name: string
}

interface Props {
  users: User[]
  userId: string | undefined
  setUserId: (userId: string | undefined) => void
}

export function UserSelect({ users, userId, setUserId }: Props) {
  return (
    <Select
      value={userId}
      onValueChange={(value) => setUserId(value === "all" ? undefined : value)}
    >
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Filter by user" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Users</SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
