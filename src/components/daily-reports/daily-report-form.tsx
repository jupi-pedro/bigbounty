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
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/shared/date-picker"

// Schema definition
const schema = z.object({
  date: z.date(),
  content: z.string().min(1, "Content is required"),
})

export type DailyReportFormData = z.infer<typeof schema>

interface DailyReportFormProps {
  defaultValues?: DailyReportFormData
  onSubmit: (data: DailyReportFormData) => void
  isPending?: boolean
  submitLabel?: string
}

export function DailyReportForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Submit Report",
}: DailyReportFormProps) {
  const form = useForm<DailyReportFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      date: new Date(),
      content: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Textarea */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[400px]"
                  rows={20}
                  placeholder="What did you work on today?"
                  {...field}
                />
              </FormControl>
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
