"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { authenticate } from "@/lib/actions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  required
                  minLength={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button type="submit" className="mt-4 w-full" disabled={isPending}>
          Log in
        </Button>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
      </form>
    </Form>
  )
}
