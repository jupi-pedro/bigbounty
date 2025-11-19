"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartConfig = {
  inProgress: {
    label: "In Progress",
    color: "hsl(217 91% 60%)", // lighter blue
  },
  declined: {
    label: "Declined",
    color: "hsl(0 70% 65%)", // softer red
  },
  withdrawn: {
    label: "Withdrawn",
    color: "hsl(215 16% 47%)", // gray
  },
  offered: {
    label: "Offered",
    color: "hsl(142 60% 45%)", // softer green
  },
} satisfies ChartConfig

interface ChartDataItem {
  identity: string
  inProgress: number
  declined: number
  withdrawn: number
  offered: number
}

export function InterviewProcessesByIdentityChart() {
  const [timeRange, setTimeRange] = useState("all")
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/analytics/interview-processes-by-identity?timeRange=${timeRange}`
        )
        if (response.ok) {
          const data = await response.json()
          setChartData(data)
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [timeRange])

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7d":
        return "last 7 days"
      case "14d":
        return "last 2 weeks"
      case "21d":
        return "last 3 weeks"
      case "30d":
        return "last 30 days"
      case "60d":
        return "last 2 months"
      case "all":
      default:
        return "all time"
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Interview Processes per Identity</CardTitle>
        <CardDescription>
          Interview process statuses for {getTimeRangeLabel()}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="*:data-[slot=toggle-group-item]:!px-4"
          >
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="14d">Last 2 weeks</ToggleGroupItem>
            <ToggleGroupItem value="21d">Last 3 weeks</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="60d">Last 2 months</ToggleGroupItem>
            <ToggleGroupItem value="all">All</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="text-muted-foreground">No data available</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="identity"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                formatter={(value) => {
                  const key = value as keyof typeof chartConfig
                  return chartConfig[key]?.label || value
                }}
              />
              <Bar
                dataKey="inProgress"
                fill="var(--color-inProgress)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="declined"
                fill="var(--color-declined)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="withdrawn"
                fill="var(--color-withdrawn)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="offered"
                fill="var(--color-offered)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
