import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  goal: z.string().min(1, "Goal is required"),
  backstory: z.string().optional(),
  memory_enabled: z.boolean().default(true),
  verbose: z.boolean().default(false),
  allow_delegation: z.boolean().default(false),
  max_iterations: z.number().min(1).default(5),
  max_rpm: z.number().min(0).nullable().optional(),
  tools: z.record(z.any()).optional(),
  llm_config: z.record(z.any()).optional(),
  is_template: z.boolean().default(false),
  is_builtin: z.boolean().default(false),
  template_id: z.number().nullable().optional(),
  template_version: z.number().nullable().optional(),
});

export type AgentFormData = z.infer<typeof agentSchema>; 