"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { editUser } from "@/lib/actions/users"
import {
  UserForm,
  UserFormData,
} from "@/components/users/user-form"
import { useState } from "react"
import { User } from "@prisma/client"

interface EditUserFormProps {
  user: User
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (values: UserFormData) => {
    setIsPending(true)

    const formData = new FormData()
    formData.set("id", user.id)
    formData.set("name", values.name)
    formData.set("email", values.email)
    if (values.password) {
      formData.set("password", values.password)
    }
    formData.set("role", values.role)

    const result = await editUser(undefined, formData)
    setIsPending(false)

    if (result?.success) {
      toast.success("User updated successfully")
      router.push("/users")
    } else {
      toast.error(result?.message || "Failed to update user")
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <UserForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Update User"
        isEdit={true}
        defaultValues={{
          name: user.name,
          email: user.email,
          password: "",
          role: user.role,
        }}
      />
    </div>
  )
}