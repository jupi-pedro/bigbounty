"use client"

import { useActionState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createJobLink } from "@/lib/actions/job-links"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CompanyAutocomplete from "./company-autocomplete"

const schema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  link: z.string().url("Enter a valid URL"),
  company: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CreateJobLinkForm() {
  const router = useRouter()

  const [result, formAction, isPending] = useActionState(
    createJobLink,
    undefined
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: "",
      link: "",
      company: "",
      description: "",
    },
  })

  useEffect(() => {
    if (result?.success) {
      toast.success("Job link has been created successfully")
      form.reset()
    }
  }, [result?.success, router])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Senior React Developer"
                  {...field}
                  autoFocus
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Link URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/job"
                  {...field}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <CompanyAutocomplete field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Job Link"}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Brief job description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {result && result.message && (
          <p className="text-sm text-red-500">{result.message}</p>
        )}
      </form>
    </Form>
  )
}
