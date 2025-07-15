import * as React from "react"

import { NavUser } from "@/components/layout-parts/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconCirclePlusFilled,
  IconDeviceUnknown,
  IconDrone,
  IconList,
  IconMail,
} from "@tabler/icons-react"
import Link from "next/link"
import { auth } from "@/lib/auth/auth"
import { Button } from "../ui/button"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await auth()

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <IconDrone className="!size-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">DroneUp Space</span>
                  <span className="truncate text-xs">
                    To infinity and beyond
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Getting Jobs</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/job-links">
                  <SidebarMenuButton>
                    <IconList />
                    <span className="font-medium">Jobs Links</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/interview-questions">
                  <SidebarMenuButton>
                    <IconDeviceUnknown />
                    <span className="font-medium">Interview Questions</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && user.user && <NavUser user={user.user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
