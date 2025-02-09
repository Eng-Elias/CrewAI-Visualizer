"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const taskFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  expected_output: z.string().min(10, {
    message: "Expected output must be at least 10 characters.",
  }),
  async_execution: z.boolean().default(false),
  tools: z.any().optional(),
  config: z.any().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskTemplateFormProps {
  initialData?: TaskFormValues;
  onSubmit: (data: TaskFormValues) => void;
  isLoading?: boolean;
}

export function TaskTemplateForm({
  initialData,
  onSubmit,
  isLoading = false,
}: TaskTemplateFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      expected_output: "",
      async_execution: false,
      tools: [],
      config: {},
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Web Research Task" {...field} />
              </FormControl>
              <FormDescription>
                The name of your task template.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Research and gather information about..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed description of what the task should accomplish.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expected_output"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Output</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A comprehensive report containing..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the expected output format and content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="async_execution"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Async Execution</FormLabel>
                <FormDescription>
                  Allow task to be executed asynchronously.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Template"}
        </Button>
      </form>
    </Form>
  );
}
