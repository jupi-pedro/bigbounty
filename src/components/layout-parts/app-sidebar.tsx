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
  IconBook,
  IconDeviceUnknown,
  IconDrone,
  IconList,
  IconLock,
  IconUsers,
  IconUserCheck,
} from "@tabler/icons-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/current-user"
import { hasPermission, Permission } from "@/lib/utils/permissions"

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const currentUser = await getCurrentUser()

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
              <SidebarMenuItem>
                <Link href="/interview-processes">
                  <SidebarMenuButton>
                    <IconUserCheck />
                    <span className="font-medium">Interview Process</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Work Related</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/daily-reports">
                  <SidebarMenuButton>
                    <IconBook />
                    <span className="font-medium">Daily Reports</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentUser &&
          hasPermission(currentUser.role, Permission.ListUsers) && (
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/users">
                      <SidebarMenuButton>
                        <IconUsers />
                        <span className="font-medium">Users</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/user-sessions">
                      <SidebarMenuButton>
                        <IconLock />
                        <span className="font-medium">User Sessions</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
    </Sidebar>
  )
}
