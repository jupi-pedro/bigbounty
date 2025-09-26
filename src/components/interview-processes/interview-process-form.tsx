"use client"

import { useActionState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInterviewProcess, updateInterviewProcess } from "@/lib/actions/interview-processes"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { InterviewProcess } from "@prisma/client"
import CompanyAutocomplete from "@/components/job-links/company-autocomplete"
import { interviewProcessStatuses } from "@/lib/constants/interview-step"

const schema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  identity: z.string().min(1, "Identity is required"),
  person: z.string().min(1, "Person name is required"),
  jobDescription: z.string().optional(),
  interviewDetails: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  expectedSteps: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface InterviewProcessFormProps {
  interviewProcess?: InterviewProcess
  mode: "create" | "edit"
}

export function InterviewProcessForm({ interviewProcess, mode }: InterviewProcessFormProps) {
  const router = useRouter()
  const action = mode === "edit" && interviewProcess 
    ? updateInterviewProcess.bind(null, interviewProcess.id)
    : createInterviewProcess

  const [result, formAction, isPending] = useActionState(
    action,
    undefined
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: interviewProcess?.jobTitle || "",
      company: interviewProcess?.company || "",
      identity: interviewProcess?.identity || "",
      person: interviewProcess?.person || "",
      jobDescription: interviewProcess?.jobDescription || "",
      interviewDetails: interviewProcess?.interviewDetails || "",
      status: interviewProcess?.status || "In Progress",
      expectedSteps: interviewProcess?.expectedSteps?.toString() || "",
    },
  })

  useEffect(() => {
    if (result?.success) {
      if (mode === "create") {
        toast.success("Interview process has been created successfully")
        // Redirect to edit page after creation
        if (result.id) {
          router.push(`/interview-processes/edit/${result.id}`)
        }
      } else {
        toast.success("Interview process has been updated successfully")
        // Stay on the same edit page
      }
    }
  }, [result, mode, router])

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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <CompanyAutocomplete field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identity</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. John Doe"
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
          name="person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Person</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Jane Smith"
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                name="status"
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {interviewProcessStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedSteps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Steps (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 4"
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
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Enter the full job description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interviewDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Details (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Enter interview details, notes, or requirements..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push("/interview-processes")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending 
              ? (mode === "create" ? "Creating..." : "Updating...") 
              : (mode === "create" ? "Create Interview Process" : "Update Interview Process")}
          </Button>
        </div>

        {result && result.message && (
          <p className="text-sm text-red-500">{result.message}</p>
        )}
      </form>
    </Form>
  )
}