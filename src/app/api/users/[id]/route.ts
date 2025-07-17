import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"

export const GET = withApiPermission(
  Permission.ListUsers,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    } catch (error) {
      console.error("Get user error:", error)
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      )
    }
  }
)

export const PUT = withApiPermission(
  Permission.EditUser,
  async (req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    try {
      const { name, email, password, role } = await req.json()

      if (!name || !email || !role) {
        return NextResponse.json(
          { error: "Name, email, and role are required" },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: "Email is already taken by another user" },
          { status: 400 }
        )
      }

      const updateData: {
        name: string
        email: string
        role: Role
        password?: string
      } = {
        name,
        email,
        role: role as Role,
      }

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10)
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      })

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    } catch (error) {
      console.error("Update user error:", error)
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      )
    }
  }
)

export const DELETE = withApiPermission(
  Permission.DeleteUser,
  async (_req: Request, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params

    try {
      await prisma.user.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Delete user error:", error)
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      )
    }
  }
)