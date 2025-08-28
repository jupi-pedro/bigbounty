"use client"

import { useActionState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInterviewStep, updateInterviewStep } from "@/lib/actions/interview-steps"
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
import { DatePicker } from "@/components/shared/date-picker"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { InterviewStep } from "@prisma/client"
import { interviewStepTypes } from "@/lib/constants/interview-step"

const schema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(2, "Title is required"),
  date: z.date({
    message: "Date is required",
  }),
  interviewerName: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

interface InterviewStepFormProps {
  interviewStep?: InterviewStep
  interviewProcessId: string
  mode: "create" | "edit"
}

export function InterviewStepForm({ interviewStep, interviewProcessId, mode }: InterviewStepFormProps) {
  const router = useRouter()
  const action = mode === "edit" && interviewStep 
    ? updateInterviewStep.bind(null, interviewStep.id, interviewProcessId)
    : createInterviewStep.bind(null, interviewProcessId)

  const [result, formAction, isPending] = useActionState(
    action,
    undefined
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: interviewStep?.type || "",
      title: interviewStep?.title || "",
      date: interviewStep?.date ? new Date(interviewStep.date) : undefined,
      interviewerName: interviewStep?.interviewerName || "",
      note: interviewStep?.note || "",
    },
  })

  useEffect(() => {
    if (result?.success) {
      if (mode === "create") {
        toast.success("Interview step has been created successfully")
        router.push(`/interview-processes/edit/${interviewProcessId}`)
      } else {
        toast.success("Interview step has been updated successfully")
        router.push(`/interview-processes/edit/${interviewProcessId}`)
      }
    }
  }, [result, mode, router, interviewProcessId])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {/* First row - Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  name="type"
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interviewStepTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <input
                      type="hidden"
                      name="date"
                      value={field.value ? field.value.toISOString().split('T')[0] : ""}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Technical Interview Round 1"
                  {...field}
                  name="title"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interviewerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer Name (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. John Smith"
                  {...field}
                  name="interviewerName"
                  value={field.value || ""}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="min-h-[240px]"
                  placeholder="Add any notes about this interview step..."
                  {...field}
                  name="note"
                  value={field.value || ""}
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
            onClick={() => router.push(`/interview-processes/edit/${interviewProcessId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending 
              ? (mode === "create" ? "Creating..." : "Updating...") 
              : (mode === "create" ? "Create Interview Step" : "Update Interview Step")}
          </Button>
        </div>

        {result && result.message && (
          <p className="text-sm text-red-500">{result.message}</p>
        )}
      </form>
    </Form>
  )
}