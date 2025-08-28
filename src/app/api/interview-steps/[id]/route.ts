import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"

export const GET = withApiPermission(
  Permission.ListInterviewSteps,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview step ID" },
        { status: 400 }
      )
    }

    try {
      const interviewStep = await prisma.interviewStep.findUnique({
        where: { id },
      })

      if (!interviewStep) {
        return NextResponse.json(
          { error: "Interview step not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(interviewStep)
    } catch (error) {
      console.error("Get error:", error)
      return NextResponse.json(
        { error: "Failed to get interview step" },
        { status: 500 }
      )
    }
  }
)

export const PUT = withApiPermission(
  Permission.EditInterviewStep,
  async (req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview step ID" },
        { status: 400 }
      )
    }

    try {
      const body = await req.json()
      const { type, title, date, interviewerName, note } = body

      const updated = await prisma.interviewStep.update({
        where: { id },
        data: {
          type,
          title,
          date: new Date(date),
          interviewerName,
          note,
        },
      })

      return NextResponse.json(updated)
    } catch (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to update interview step" },
        { status: 500 }
      )
    }
  }
)

export const DELETE = withApiPermission(
  Permission.DeleteInterviewStep,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: "Missing interview step ID" },
        { status: 400 }
      )
    }

    try {
      await prisma.interviewStep.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete interview step" },
        { status: 500 }
      )
    }
  }
)