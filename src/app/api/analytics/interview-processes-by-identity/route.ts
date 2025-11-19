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

    // Fetch interview processes with optional date filter
    const interviewProcesses = await prisma.interviewProcess.findMany({
      where: startDate ? {
        createdAt: {
          gte: startDate,
        },
      } : undefined,
      select: {
        identity: true,
        status: true,
      },
    })

    // Group by identity and count by status
    const groupedData: {
      [identity: string]: {
        inProgress: number
        declined: number
        withdrawn: number
        offered: number
      }
    } = {}

    interviewProcesses.forEach(process => {
      if (!groupedData[process.identity]) {
        groupedData[process.identity] = {
          inProgress: 0,
          declined: 0,
          withdrawn: 0,
          offered: 0,
        }
      }

      const status = process.status.toLowerCase()
      if (status === 'in progress') {
        groupedData[process.identity].inProgress++
      } else if (status === 'declined') {
        groupedData[process.identity].declined++
      } else if (status === 'withdrawn') {
        groupedData[process.identity].withdrawn++
      } else if (status === 'offered') {
        groupedData[process.identity].offered++
      }
    })

    // Convert to array format for the chart
    const chartData = Object.entries(groupedData).map(([identity, counts]) => ({
      identity,
      inProgress: counts.inProgress,
      declined: counts.declined,
      withdrawn: counts.withdrawn,
      offered: counts.offered,
    }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching interview processes by identity chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
