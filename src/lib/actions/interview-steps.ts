"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import { BadRequestError, ForbiddenError } from "@/lib/errors"
import { ActionResult } from "@/types/actionResult"
import { hasPermission, Permission } from "@/lib/utils/permissions"

export async function createInterviewStep(
  interviewProcessId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new ForbiddenError("You must be logged in.")

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !hasPermission(user.role, Permission.CreateInterviewStep)) {
      throw new ForbiddenError("You don't have permission to create interview steps.")
    }

    const type = formData.get("type") as string
    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const interviewerName = formData.get("interviewerName") as string | null
    const note = formData.get("note") as string | null

    if (!type || !title || !date) {
      throw new BadRequestError("All required fields must be filled.")
    }

    const created = await prisma.interviewStep.create({
      data: {
        type,
        title,
        date: new Date(date + 'T00:00:00.000Z'), // Ensure it's treated as a date in UTC
        interviewerName,
        note,
        interviewProcessId,
      },
    })

    revalidatePath(`/interview-processes/edit/${interviewProcessId}`)
    return {
      success: true,
      id: created.id,
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return {
        success: false,
        message: err.message,
      }
    }

    return {
      success: false,
      message: "Something went wrong.",
    }
  }
}

export async function updateInterviewStep(
  id: string,
  interviewProcessId: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new ForbiddenError("You must be logged in.")

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !hasPermission(user.role, Permission.EditInterviewStep)) {
      throw new ForbiddenError("You don't have permission to edit interview steps.")
    }

    const type = formData.get("type") as string
    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const interviewerName = formData.get("interviewerName") as string | null
    const note = formData.get("note") as string | null

    if (!type || !title || !date) {
      throw new BadRequestError("All required fields must be filled.")
    }

    await prisma.interviewStep.update({
      where: { id },
      data: {
        type,
        title,
        date: new Date(date + 'T00:00:00.000Z'), // Ensure it's treated as a date in UTC
        interviewerName,
        note,
      },
    })

    revalidatePath(`/interview-processes/edit/${interviewProcessId}`)
    return {
      success: true,
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
      return {
        success: false,
        message: err.message,
      }
    }

    return {
      success: false,
      message: "Something went wrong.",
    }
  }
}