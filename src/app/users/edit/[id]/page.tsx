import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditUserForm } from "@/components/users/edit-user-form"

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    return notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <EditUserForm user={user} />
    </div>
  )
}