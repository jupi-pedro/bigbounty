import { withApiPermission } from "@/lib/auth/with-api-permission"
import { prisma } from "@/lib/prisma"
import { Permission } from "@/lib/utils/permissions"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"

export const GET = withApiPermission(
  Permission.ListUsers,
  async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(users)
    } catch (error) {
      console.error("List users error:", error)
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      )
    }
  }
)

export const POST = withApiPermission(
  Permission.CreateUser,
  async (req: Request) => {
    try {
      const { name, email, password, role } = await req.json()

      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as Role,
        },
      })

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    } catch (error) {
      console.error("Create user error:", error)
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }
  }
)