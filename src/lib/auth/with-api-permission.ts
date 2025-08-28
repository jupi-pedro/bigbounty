import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/current-user"
import { hasPermission, Permission } from "@/lib/utils/permissions"
import { Role } from "@prisma/client"

type ApiHandler<TContext = unknown> = (
  req: Request,
  context: TContext
) => Promise<Response>

export function withApiPermission<TContext = unknown>(
  permission: Permission | Permission[],
  handler: ApiHandler<TContext>
): ApiHandler<TContext> {
  return async (req, context) => {
    const user = await getCurrentUser()
    const role = user?.role as Role | undefined

    const permissions = Array.isArray(permission) ? permission : [permission]
    const allowed = role && permissions.some(p => hasPermission(role, p))

    if (!allowed) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    return handler(req, context)
  }
}
