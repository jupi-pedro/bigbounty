"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth/auth"
import { BadRequestError, ForbiddenError } from "@/lib/errors"
import { ActionResult } from "@/types/actionResult"

export async function createJobLink(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new ForbiddenError("You must be logged in.")

    const jobTitle = formData.get("jobTitle") as string
    const link = formData.get("link") as string
    const companyName = formData.get("company") as string
    const sourceName = formData.get("source") as string
    const description = formData.get("description") as string | null

    if (!jobTitle || !link || !companyName) {
      throw new BadRequestError("All required fields must be filled.")
    }

    const company = await prisma.company.upsert({
      where: { name: companyName },
      update: {},
      create: { name: companyName },
    })

    const source = await prisma.jobLinkSource.upsert({
      where: { name: sourceName },
      update: {},
      create: { name: sourceName },
    })

    await prisma.jobLink.create({
      data: {
        jobTitle,
        link,
        description,
        userId,
        companyId: company.id,
        jobLinkSourceId: source.id,
      },
    })

    revalidatePath("/job-links")
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
