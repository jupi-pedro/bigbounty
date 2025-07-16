import { Permission } from "@/lib/utils/permissions"
import { withPermission } from "@/lib/auth/with-permission"

export default withPermission(
  Permission.CreateDailyReport,
  async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }
)
