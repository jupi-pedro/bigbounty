import { hasPermission, Permission } from "@/lib/utils/permissions"
import { getCurrentUser } from "@/lib/current-user"
import { Role } from "@prisma/client"
import { ReactNode } from "react"
import { Forbidden } from "@/components/forbidden"

type ComponentWithPermission<Props = {}> = (props: Props) => Promise<ReactNode>

export function withPermission<Props = {}>(
  required: Permission,
  Component: ComponentWithPermission<Props>
) {
  return async function Wrapper(props: Props) {
    const user = await getCurrentUser()
    const role = user?.role as Role | undefined

    const allowed = role && hasPermission(role, required)

    if (!allowed) {
      return <Forbidden />
    }

    return await Component(props)
  }
}
