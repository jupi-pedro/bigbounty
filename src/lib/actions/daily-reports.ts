"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import { BadRequestError, ForbiddenError } from "@/lib/errors"
import { ActionResult } from "@/types/actionResult"
import { hasPermission, Permission } from "@/lib/utils/permissions"
import { getCurrentUser } from "@/lib/current-user"

export async function createDailyReport(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new ForbiddenError("You must be logged in.")

    const dateStr = formData.get("date") as string
    const content = formData.get("content") as string

    if (!dateStr || !content) {
      throw new BadRequestError("Both date and content are required.")
    }

    const [year, month, day] = dateStr.split("-").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

    const existing = await prisma.dailyReport.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    })

    if (existing) {
      throw new BadRequestError(
        "You have already submitted a report for this date."
      )
    }

    await prisma.dailyReport.create({
      data: {
        userId,
        date,
        content,
      },
    })

    revalidatePath("/daily-reports")

    return {
      success: true,
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong.",
    }
  }
}

export async function editDailyReport(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new ForbiddenError("You must be logged in.")

    const currentUser = await getCurrentUser()

    const id = formData.get("id") as string
    const dateStr = formData.get("date") as string
    const content = formData.get("content") as string

    if (!id || !dateStr || !content) {
      throw new BadRequestError("All fields are required.")
    }

    const [year, month, day] = dateStr.split("-").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

    const existing = await prisma.dailyReport.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new BadRequestError("Daily report not found.")
    }

    if (
      currentUser &&
      !hasPermission(currentUser.role, Permission.ManageOtherDailyReports) &&
      existing.userId !== currentUser.id
    ) {
      throw new ForbiddenError("You can only edit your own reports.")
    }

    const conflict = await prisma.dailyReport.findUnique({
      where: {
        userId_date: {
          userId: existing.userId,
          date,
        },
      },
    })

    if (conflict && conflict.id !== id) {
      throw new BadRequestError(
        "Another report exists for this user on that date."
      )
    }

    await prisma.dailyReport.update({
      where: { id },
      data: {
        date,
        content,
      },
    })

    revalidatePath("/daily-reports")

    return { success: true }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong.",
    }
  }
}
