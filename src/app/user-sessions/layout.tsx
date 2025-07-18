import { withPermission } from "@/lib/auth/with-permission"
import { Permission } from "@/lib/utils/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Sessions | Drone Dev",
  description: "Monitor active user sessions and connection details",
}

export default withPermission(
  Permission.ListUsers,
  async ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }
)
