import { AppSidebar } from "@/components/layout-parts/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout-parts/site-header"
import { getCurrentUser } from "@/lib/current-user"
import { UserProvider } from "@/components/layout-parts/user-provider"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("User not found in DB")
  }

  return (
    <UserProvider user={user}>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </UserProvider>
  )
}
