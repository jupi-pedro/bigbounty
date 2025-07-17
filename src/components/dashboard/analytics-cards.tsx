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

  // Get all jobs today with company info
  const jobsToday = await prisma.jobLink.findMany({
    where: {
      createdAt: {
        gte: startOfToday,
      },
    },
    include: { company: true },
  })

  // Count total jobs
  const totalJobsToday = jobsToday.length

  // Count unique jobs (by job title and company name)
  const uniqueJobs = new Map<string, boolean>()
  jobsToday.forEach(job => {
    const key = `${job.jobTitle.trim().toLowerCase()}_${job.company.name.trim().toLowerCase()}`
    uniqueJobs.set(key, true)
  })
  const uniqueJobsToday = uniqueJobs.size

  // Calculate proposals (total × 3)
  const proposalsToday = totalJobsToday * 3

  return {
    proposalsToday,
    uniqueJobsToday,
  }
}

export async function AnalyticsCards() {
  const { proposalsToday, uniqueJobsToday } = await getJobLinksData()

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today&apos;s Proposals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {proposalsToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total proposals sent today
            <IconTrendingUp />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jobs Posted Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {uniqueJobsToday}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Unique job opportunities today
            <IconTrendingUp />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
