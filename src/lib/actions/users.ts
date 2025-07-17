"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BadRequestError } from "@/lib/errors"
import { ActionResult } from "@/types/actionResult"
import { Role } from "@prisma/client"
import bcrypt from "bcrypt"

export async function createUser(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as Role

    if (!name || !email || !password || !role) {
      throw new BadRequestError("All fields are required.")
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestError("User with this email already exists.")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath("/users")

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

export async function editUser(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult | undefined> {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as Role

    if (!id || !name || !email || !role) {
      throw new BadRequestError("Name, email, and role are required.")
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestError("Email is already taken by another user.")
    }

    const updateData: {
      name: string
      email: string
      role: Role
      password?: string
    } = {
      name,
      email,
      role,
    }

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/users")

    return { success: true }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong.",
    }
  }
}