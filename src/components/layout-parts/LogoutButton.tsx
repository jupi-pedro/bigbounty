"use client"

import { IconLogout } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth/auth"

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/" })
      }}
    >
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
