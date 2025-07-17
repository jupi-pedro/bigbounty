import { withPermission } from "@/lib/auth/with-permission"
import { Permission } from "@/lib/utils/permissions"

export default withPermission(
  Permission.CreateUser,
  async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }
)
