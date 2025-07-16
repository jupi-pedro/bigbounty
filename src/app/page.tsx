import { Permission } from "@/lib/utils/permissions"
import { withPermission } from "@/lib/auth/with-permission"

export default withPermission(Permission.ViewDashboard, async () => {
  return <h1 className="font-medium">Great</h1>
})
