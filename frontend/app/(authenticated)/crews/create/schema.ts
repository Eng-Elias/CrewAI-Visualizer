import * as z from "zod";

export const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  process: z.string(),
  verbose: z.boolean(),
  manager_llm: z.string(),
  function_calling_llm: z.string(),
  max_rpm: z.number(),
  language: z.string(),
  memory: z.boolean(),
  planning: z.boolean(),
  agents: z.array(z.object({
    name: z.string(),
    role: z.string(),
    goal: z.string(),
    backstory: z.string(),
    memory_enabled: z.boolean(),
    verbose: z.boolean(),
    allow_delegation: z.boolean(),
    max_iterations: z.number(),
    max_rpm: z.number().optional(),
  })),
  tasks: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    expected_output: z.string(),
    tools: z.array(z.string()),
    async_execution: z.boolean(),
  })),
});

export type FormValues = z.infer<typeof formSchema>;
