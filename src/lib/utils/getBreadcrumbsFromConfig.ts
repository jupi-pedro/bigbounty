import { routeConfig } from "@/lib/constants/routes"

type Breadcrumb = { href: string; label: string }

export function getBreadcrumbsFromConfig(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: Breadcrumb[] = []

  if (pathname === "/") {
    const root = routeConfig.find((r) => r.path === "/")
    if (root) breadcrumbs.push({ href: "/", label: root.label })
    return breadcrumbs
  }

  let currentPath = ""
  for (let i = 0; i < segments.length; i++) {
    currentPath += "/" + segments[i]
    const match = matchRoute(currentPath)
    if (match) breadcrumbs.push({ href: currentPath, label: match })
  }

  return breadcrumbs
}

function matchRoute(path: string): string | undefined {
  for (const route of routeConfig) {
    if (route.path === path) return route.label

    if (route.children) {
      for (const child of route.children) {
        if (child.path === path) return child.label

        const basePath = child.path.replace(/:\w+/, "")
        if (child.path.includes(":") && path.startsWith(basePath)) {
          return child.label
        }
      }
    }
  }

  return undefined
}
