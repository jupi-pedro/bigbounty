"use client"

import { IconLogout } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions/auth"

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="flex w-full items-center gap-2 justify-start"
      >
        <IconLogout className="size-4" />
        Log out
      </Button>
    </form>
  )
}
