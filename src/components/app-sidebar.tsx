import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { signOut } from "@/lib/auth/auth"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const handleClickLogout = async () => {
    await signOut({ redirectTo: "/" })
  }
  return (
    <Sidebar>
      <SidebarContent>
        <div className="pt-4 pb-1 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Drone Up Logo"
            width={150}
            height={32}
            priority
          />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <form
          className="w-full"
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button className="w-full" type="submit" variant="outline" size="sm">
            Log out <LogOut />
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
