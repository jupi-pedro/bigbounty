import { prisma } from "@/lib/prisma"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp } from "@tabler/icons-react"

async function getJobLinksData() {
  const now = new Date()

  // Get start of today
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  // Get start of this week (Sunday)
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())

  // Get jobs today
  const jobsToday = await prisma.jobLink.count({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
  })

  // Get jobs this week
  const jobsThisWeek = await prisma.jobLink.count({
    where: {
      createdAt: {
        gte: startOfWeek,
      },
    },
  })

  return {
    jobsToday,
    jobsThisWeek,
  }
}

export async function AnalyticsCards() {
  const { jobsToday, jobsThisWeek } = await getJobLinksData()

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jobs Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {jobsToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Job links posted today
            <IconTrendingUp />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jobs This Week</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {jobsThisWeek}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Job links posted this week
            <IconTrendingUp />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
