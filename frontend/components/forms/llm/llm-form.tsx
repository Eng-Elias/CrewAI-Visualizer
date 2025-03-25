import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LLMFormData, llmSchema } from "@/lib/schemas/llm";
import { FormSection } from "@/components/forms/form-section";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityFieldControl } from "@/lib/types/field-control";
import { LLM } from "@/utils/api/types";
import { useLLMs } from "@/hooks/use-llms";

export interface LLMFormProps {
  llm?: Partial<LLM>;
  onSubmit: (data: LLMFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

type LLMFormInputs = Omit<LLMFormData, "models"> & {
  models_string: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, string | number | boolean>;
};

export function LLMForm({
  llm,
  onSubmit,
  isLoading,
  error,
  fieldControl,
}: LLMFormProps) {
  const { providers } = useLLMs();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LLMFormInputs>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      name: llm?.name || "",
      provider: llm?.provider || "",
      models_string: llm?.models?.join(", ") || "",
      api_key: llm?.api_key,
      temperature: llm?.temperature,
      max_tokens: llm?.max_tokens,
      config: llm?.config,
    },
  });

  const handleFormSubmit = (data: LLMFormInputs) => {
    // The schema will handle the transformation from models_string to models
    onSubmit(data as unknown as LLMFormData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FormSection
        title="Basic Information"
        description="Core details about the LLM"
        collapsible
        defaultExpanded
      >
        <FormField
          label="Name"
          required
          section="BASIC"
          field="name"
          fieldControl={fieldControl}
          error={errors.name?.message}
        >
          <Input {...register("name")} placeholder="e.g., GPT-4" />
        </FormField>

        <FormField
          label="Provider"
          required
          section="BASIC"
          field="provider"
          fieldControl={fieldControl}
          error={errors.provider?.message}
        >
          <Select
            onValueChange={(value) => setValue("provider", value)}
            defaultValue={llm?.provider}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {providers.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Models"
          required
          section="BASIC"
          field="models_string"
          fieldControl={fieldControl}
          error={errors.models_string?.message}
          description="Enter model names separated by commas"
        >
          <Input
            {...register("models_string")}
            placeholder="e.g., gpt-4-turbo-preview, gpt-4, gpt-3.5-turbo"
          />
        </FormField>

        <FormField
          label="API Key"
          section="BASIC"
          field="api_key"
          fieldControl={fieldControl}
          error={errors.api_key?.message}
        >
          <Input
            type="password"
            {...register("api_key")}
            placeholder="Enter your API key"
          />
        </FormField>
      </FormSection>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
