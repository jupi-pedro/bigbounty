"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import { BadRequestError, ForbiddenError } from "@/lib/errors"
import { ActionResult } from "@/types/actionResult"
import { hasPermission, Permission } from "@/lib/utils/permissions"

export async function createInterviewProcess(
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

    if (!user || !hasPermission(user.role, Permission.CreateInterviewProcess)) {
      throw new ForbiddenError("You don't have permission to create interview processes.")
    }

    const jobTitle = formData.get("jobTitle") as string
    const company = formData.get("company") as string
    const identity = formData.get("identity") as string
    const person = formData.get("person") as string
    const jobDescriptionRaw = formData.get("jobDescription") as string | null
    const interviewDetailsRaw = formData.get("interviewDetails") as string | null
    const status = formData.get("status") as string
    const expectedStepsStr = formData.get("expectedSteps") as string | null

    // Convert empty strings to null for optional text fields
    const jobDescription = jobDescriptionRaw === "" ? null : jobDescriptionRaw
    const interviewDetails = interviewDetailsRaw === "" ? null : interviewDetailsRaw
    const expectedSteps = expectedStepsStr && expectedStepsStr !== "" ? parseInt(expectedStepsStr, 10) : null

    if (!jobTitle || !company || !identity || !person || !status) {
      throw new BadRequestError("All required fields must be filled.")
    }

    const created = await prisma.interviewProcess.create({
      data: {
        jobTitle,
        company,
        identity,
        person,
        jobDescription,
        interviewDetails,
        status,
        expectedSteps,
      },
    })

    revalidatePath("/interview-processes")
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

export async function updateInterviewProcess(
  id: string,
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

    if (!user || !hasPermission(user.role, Permission.EditInterviewProcess)) {
      throw new ForbiddenError("You don't have permission to edit interview processes.")
    }

    const jobTitle = formData.get("jobTitle") as string
    const company = formData.get("company") as string
    const identity = formData.get("identity") as string
    const person = formData.get("person") as string
    const jobDescriptionRaw = formData.get("jobDescription") as string | null
    const interviewDetailsRaw = formData.get("interviewDetails") as string | null
    const status = formData.get("status") as string
    const expectedStepsStr = formData.get("expectedSteps") as string | null

    // Convert empty strings to null for optional text fields
    const jobDescription = jobDescriptionRaw === "" ? null : jobDescriptionRaw
    const interviewDetails = interviewDetailsRaw === "" ? null : interviewDetailsRaw
    const expectedSteps = expectedStepsStr && expectedStepsStr !== "" ? parseInt(expectedStepsStr, 10) : null

    if (!jobTitle || !company || !identity || !person || !status) {
      throw new BadRequestError("All required fields must be filled.")
    }

    await prisma.interviewProcess.update({
      where: { id },
      data: {
        jobTitle,
        company,
        identity,
        person,
        jobDescription,
        interviewDetails,
        status,
        expectedSteps,
      },
    })

    revalidatePath("/interview-processes")
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