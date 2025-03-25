import { z } from "zod";

const baseLLMSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  models_string: z
    .string()
    .min(1, "At least one model is required"),
  api_key: z.string().optional(),
});

export const llmSchema = baseLLMSchema.transform((data) => {
  const { models_string, ...rest } = data;
  return {
    ...rest,
    models: models_string
      .split(",")
      .map((model) => model.trim())
      .filter((model) => model.length > 0),
  };
});

export type LLMFormData = z.infer<typeof llmSchema>;
