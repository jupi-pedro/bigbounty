import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"

export const GET = withApiPermission(
  Permission.ListInterviewProcesses,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview process ID" },
        { status: 400 }
      )
    }

    try {
      const interviewProcess = await prisma.interviewProcess.findUnique({
        where: { id },
      })

      if (!interviewProcess) {
        return NextResponse.json(
          { error: "Interview process not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(interviewProcess)
    } catch (error) {
      console.error("Get error:", error)
      return NextResponse.json(
        { error: "Failed to get interview process" },
        { status: 500 }
      )
    }
  }
)

export const PUT = withApiPermission(
  Permission.EditInterviewProcess,
  async (req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview process ID" },
        { status: 400 }
      )
    }

    try {
      const body = await req.json()
      const { jobTitle, company, identity, person, jobDescription } = body

      const updated = await prisma.interviewProcess.update({
        where: { id },
        data: {
          jobTitle,
          company,
          identity,
          person,
          jobDescription,
        },
      })

      return NextResponse.json(updated)
    } catch (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to update interview process" },
        { status: 500 }
      )
    }
  }
)

export const DELETE = withApiPermission(
  Permission.DeleteInterviewProcess,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview process ID" },
        { status: 400 }
      )
    }

    try {
      await prisma.interviewProcess.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete interview process" },
        { status: 500 }
      )
    }
  }
)