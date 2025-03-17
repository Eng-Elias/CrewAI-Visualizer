import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LLM, LLMFormData } from "@/utils/api/types";
import { getLLMProviders } from "@/utils/api/llm-api";
import { JsonEditor } from "json-edit-react";

// Form schema with separate input field for models
const llmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  api_key: z.string().optional(),
  modelsInput: z.string().optional(),
  config: z.any().optional(),
});

// Type for form values
type FormValues = z.infer<typeof llmSchema>;

interface CreateEditLLMModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  llm?: LLM | null;
  onSubmit: (data: LLMFormData) => Promise<void>;
}

export function CreateEditLLMModal({
  open,
  onOpenChange,
  llm,
  onSubmit,
}: CreateEditLLMModalProps) {
  const [providers, setProviders] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      name: llm?.name || "",
      provider: llm?.provider || "",
      api_key: llm?.api_key || "",
      modelsInput: llm?.models ? llm.models.join(", ") : "",
      config: llm?.config || {},
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form with llm values when modal opens
      form.reset({
        name: llm?.name || "",
        provider: llm?.provider || "",
        api_key: llm?.api_key || "",
        modelsInput: llm?.models ? llm.models.join(", ") : "",
        config: llm?.config || {},
      });

      // Fetch providers
      const fetchProviders = async () => {
        try {
          setIsLoading(true);
          const providersData = await getLLMProviders();
          if (Object.keys(providersData).length === 0) {
            // Fallback providers if API fails
            setProviders({
              OPENAI: "OpenAI",
              ANTHROPIC: "Anthropic",
              GEMINI: "Gemini",
              DEEPSEEK: "DeepSeek",
              OLLAMA: "Ollama",
            });
          } else {
            setProviders(providersData);
          }
        } catch (error) {
          console.error("Failed to fetch providers:", error);
          // Fallback providers if API fails
          setProviders({
            OPENAI: "OpenAI",
            ANTHROPIC: "Anthropic",
            GEMINI: "Gemini",
            DEEPSEEK: "DeepSeek",
            OLLAMA: "Ollama",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchProviders();
    }
  }, [open, llm, form]);

  const handleSubmit = async (data: FormValues) => {
    // Convert modelsInput to models array
    const models = data.modelsInput
      ? data.modelsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Create the LLMFormData object
    const formData: LLMFormData = {
      name: data.name,
      provider: data.provider,
      api_key: data.api_key,
      models: models,
      config: data.config,
    };

    await onSubmit(formData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{llm ? "Edit" : "Create"} LLM</DialogTitle>
          <DialogDescription>
            {llm
              ? "Update the details of your LLM configuration."
              : "Configure a new LLM for your agents to use."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="GPT-4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(providers).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
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
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="sk-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelsInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Models (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="gpt-4, gpt-3.5-turbo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration</FormLabel>
                  <FormControl>
                    <div className="border rounded-md p-4 bg-secondary">
                      <JsonEditor
                        data={field.value}
                        setData={(newValue) => field.onChange(newValue)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {llm ? "Update" : "Create"} LLM
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
