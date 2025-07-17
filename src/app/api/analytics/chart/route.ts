import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getDateString(date: Date) {
  // Get date in YYYY-MM-DD format using only year, month, day
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    
    const days = timeRange === '7d' ? 7 : 30
    const now = new Date()
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
    
    const jobLinks = await prisma.jobLink.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group by date using server dates as-is
    const groupedData: { [key: string]: number } = {}
    
    // Initialize all dates with 0 counts
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
      const dateStr = getDateString(date)
      groupedData[dateStr] = 0
    }

    // Count job links by date
    jobLinks.forEach(job => {
      const dateStr = getDateString(job.createdAt)
      if (groupedData[dateStr] !== undefined) {
        groupedData[dateStr]++
      } else {
        // If the date falls outside our initialized range, still count it
        groupedData[dateStr] = (groupedData[dateStr] || 0) + 1
      }
    })

    const chartData = Object.entries(groupedData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        jobs: count,
      }))

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}