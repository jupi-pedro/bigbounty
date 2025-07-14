import { AppSidebar } from "@/components/layout-parts/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/layout-parts/site-header"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
