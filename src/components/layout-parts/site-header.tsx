"use client"

import { SidebarIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { SearchForm } from "@/components/layout-parts/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { getBreadcrumbsFromConfig } from "@/lib/utils/getBreadcrumbsFromConfig"
import { Fragment } from "react"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbsFromConfig(pathname)
  const last = breadcrumbs.pop()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            {last && (
              <BreadcrumbItem>
                <BreadcrumbPage>{last.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}
