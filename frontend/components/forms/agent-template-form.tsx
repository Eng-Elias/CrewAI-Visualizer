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
import { useState } from "react";

const agentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  goal: z.string().min(10, {
    message: "Goal must be at least 10 characters.",
  }),
  backstory: z.string().optional(),
  memory_enabled: z.boolean().default(true),
  verbose: z.boolean().default(false),
  allow_delegation: z.boolean().default(false),
  max_iterations: z.number().min(1).max(100).default(1),
  max_rpm: z.number().min(1).max(1000).optional(),
  llm_config: z.any().optional(),
  tools: z.any().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

interface AgentTemplateFormProps {
  initialData?: AgentFormValues;
  onSubmit: (data: AgentFormValues) => void;
  isLoading?: boolean;
}

export function AgentTemplateForm({
  initialData,
  onSubmit,
  isLoading = false,
}: AgentTemplateFormProps) {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: initialData || {
      name: "",
      role: "",
      goal: "",
      backstory: "",
      memory_enabled: true,
      verbose: false,
      allow_delegation: false,
      max_iterations: 1,
      max_rpm: undefined,
      llm_config: {},
      tools: [],
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
                <Input placeholder="Research Assistant" {...field} />
              </FormControl>
              <FormDescription>
                The name of your agent template.
              </FormDescription>
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
              <FormControl>
                <Input placeholder="Researcher" {...field} />
              </FormControl>
              <FormDescription>
                The primary role of this agent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="To gather and analyze information efficiently..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The main objective of this agent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backstory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backstory</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are an experienced research assistant..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional backstory to give the agent more context.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="memory_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Memory Enabled</FormLabel>
                  <FormDescription>
                    Allow agent to maintain context memory.
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

          <FormField
            control={form.control}
            name="verbose"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Verbose Mode</FormLabel>
                  <FormDescription>
                    Enable detailed logging output.
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

          <FormField
            control={form.control}
            name="allow_delegation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow Delegation</FormLabel>
                  <FormDescription>
                    Allow agent to delegate tasks.
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

          <FormField
            control={form.control}
            name="max_iterations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Iterations</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of iterations for task execution.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Template"}
        </Button>
      </form>
    </Form>
  );
}
