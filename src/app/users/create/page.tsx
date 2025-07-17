import { CreateUserForm } from "@/components/users/create-user-form"

export default function CreateUserPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>
      <CreateUserForm />
    </div>
  )
}