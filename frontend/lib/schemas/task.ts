import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  expected_output: z.string().min(1, "Expected output is required"),
  agent: z.number().nullable().optional(),
  // tools: z.record(z.unknown()).optional(),
  // async_execution: z.boolean().optional(),
  // config: z.record(z.unknown()).optional(),
  // context: z.array(z.number()).optional(),
  // output_json: z.record(z.unknown()).optional(),
  // is_template: z.boolean().optional(),
  // is_builtin: z.boolean().optional(),
  // template_id: z.number().nullable().optional(),
  // template_version: z.number().nullable().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
