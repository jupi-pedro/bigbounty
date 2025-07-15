import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: "Missing job link ID" }, { status: 400 })
  }

  try {
    await prisma.jobLink.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete job link" },
      { status: 500 }
    )
  }
}
