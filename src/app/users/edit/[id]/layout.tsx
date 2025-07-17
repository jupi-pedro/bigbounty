import { withPermission } from "@/lib/auth/with-permission"
import { Permission } from "@/lib/utils/permissions"

export default withPermission(
  Permission.EditUser,
  async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }
)
