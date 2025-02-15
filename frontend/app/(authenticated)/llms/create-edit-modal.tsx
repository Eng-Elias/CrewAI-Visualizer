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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LLM } from "./page";

const llmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  api_key: z.string().optional(),
  models: z.string().transform((str) => str.split(",").map((s) => s.trim())),
  config: z
    .string()
    .transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return {};
      }
    })
    .optional(),
});

type LLMFormData = z.infer<typeof llmSchema>;

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
  const form = useForm<LLMFormData>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      name: llm?.name || "",
      provider: llm?.provider || "",
      api_key: llm?.api_key || "",
      models: llm?.models || [],
      config: llm?.config ? JSON.stringify(llm.config, null, 2) : "{}",
    },
  });

  const handleSubmit = async (data: LLMFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>{llm ? "Edit" : "Create"} LLM</DialogTitle>
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
                  <FormControl>
                    <Input placeholder="OpenAI" {...field} />
                  </FormControl>
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
              name="models"
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
                  <FormLabel>Configuration (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="{}"
                      className="font-mono"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">{llm ? "Update" : "Create"} LLM</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
