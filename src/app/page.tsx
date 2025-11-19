import { Permission } from "@/lib/utils/permissions"
import { withPermission } from "@/lib/auth/with-permission"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { InterviewProcessesByIdentityChart } from "@/components/dashboard/interview-processes-by-identity-chart"
import { JobLinksChart } from "@/components/dashboard/job-links-chart"

export default withPermission(Permission.ViewDashboard, async () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AnalyticsCards />
          <div className="px-4 lg:px-6">
            <InterviewProcessesByIdentityChart />
          </div>
          <div className="px-4 lg:px-6">
            <JobLinksChart />
          </div>
        </div>
      </div>
    </div>
  )
})
