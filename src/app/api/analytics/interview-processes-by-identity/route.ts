import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'all'

    // Calculate date filter based on time range
    let startDate: Date | undefined
    const now = new Date()

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
        break
      case '14d':
        startDate = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000))
        break
      case '21d':
        startDate = new Date(now.getTime() - (21 * 24 * 60 * 60 * 1000))
        break
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
        break
      case '60d':
        startDate = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000))
        break
      case 'all':
      default:
        startDate = undefined
        break
    }

    // Fetch interview processes with their steps
    const interviewProcesses = await prisma.interviewProcess.findMany({
      select: {
        identity: true,
        status: true,
        interviewSteps: {
          select: {
            date: true,
          },
          orderBy: {
            date: 'desc',
          },
          take: 1, // Get only the latest step
        },
      },
    })

    // Filter by latest step date and group by identity and count by status
    const groupedData: {
      [normalizedIdentity: string]: {
        originalIdentity: string
        inProgress: number
        declined: number
        withdrawn: number
        offered: number
      }
    } = {}

    interviewProcesses.forEach(process => {
      // If there are no steps, skip this process when filtering by date
      if (startDate && process.interviewSteps.length === 0) {
        return
      }

      // If filtering by date, check if the latest step is within the range
      if (startDate && process.interviewSteps.length > 0) {
        const latestStepDate = new Date(process.interviewSteps[0].date)
        if (latestStepDate < startDate) {
          return
        }
      }

      // Normalize identity to lowercase for case-insensitive grouping
      const normalizedIdentity = process.identity.toLowerCase()

      if (!groupedData[normalizedIdentity]) {
        groupedData[normalizedIdentity] = {
          originalIdentity: process.identity, // Keep the original casing for display
          inProgress: 0,
          declined: 0,
          withdrawn: 0,
          offered: 0,
        }
      }

      const status = process.status.toLowerCase()
      if (status === 'in progress') {
        groupedData[normalizedIdentity].inProgress++
      } else if (status === 'declined') {
        groupedData[normalizedIdentity].declined++
      } else if (status === 'withdrawn') {
        groupedData[normalizedIdentity].withdrawn++
      } else if (status === 'offered') {
        groupedData[normalizedIdentity].offered++
      }
    })

    // Convert to array format for the chart
    const chartData = Object.values(groupedData).map((data) => ({
      identity: data.originalIdentity, // Use original casing for display
      inProgress: data.inProgress,
      declined: data.declined,
      withdrawn: data.withdrawn,
      offered: data.offered,
    }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching interview processes by identity chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
