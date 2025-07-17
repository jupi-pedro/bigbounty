"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "@prisma/client"

// Base schema for all form data
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.enum([Role.Administrator, Role.Moderator, Role.Developer, Role.Viewer]),
})

export type UserFormData = z.infer<typeof baseSchema>

interface UserFormProps {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => void
  isPending?: boolean
  submitLabel?: string
  isEdit?: boolean
}

export function UserForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Submit",
  isEdit = false,
}: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      password: "",
      role: Role.Developer,
    },
  })

  const handleSubmit = (data: UserFormData) => {
    // Validate password for create mode
    if (!isEdit && (!data.password || data.password.length < 6)) {
      form.setError("password", {
        type: "manual",
        message: "Password must be at least 6 characters",
      })
      return
    }
    
    // Validate password for edit mode (only if provided)
    if (isEdit && data.password && data.password.length > 0 && data.password.length < 6) {
      form.setError("password", {
        type: "manual",
        message: "Password must be at least 6 characters",
      })
      return
    }

    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email and Role Fields - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.Administrator}>
                      Administrator
                    </SelectItem>
                    <SelectItem value={Role.Moderator}>Moderator</SelectItem>
                    <SelectItem value={Role.Developer}>Developer</SelectItem>
                    <SelectItem value={Role.Viewer}>Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    isEdit
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                  {...field}
                />
              </FormControl>
              {isEdit && (
                <p className="text-sm text-muted-foreground">
                  Leave blank to keep current password
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
