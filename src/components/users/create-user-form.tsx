"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createUser } from "@/lib/actions/users"
import {
  UserForm,
  UserFormData,
} from "@/components/users/user-form"
import { useState } from "react"

export function CreateUserForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (values: UserFormData) => {
    setIsPending(true)

    const formData = new FormData()
    formData.set("name", values.name)
    formData.set("email", values.email)
    formData.set("password", values.password || "")
    formData.set("role", values.role)

    const result = await createUser(undefined, formData)
    setIsPending(false)

    if (result?.success) {
      toast.success("User created successfully")
      router.push("/users")
    } else {
      toast.error(result?.message || "Failed to create user")
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <UserForm 
        onSubmit={handleSubmit} 
        isPending={isPending}
        submitLabel="Create User"
      />
    </div>
  )
}