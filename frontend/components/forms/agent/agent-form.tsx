import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AgentFormData, agentSchema } from "@/lib/schemas/agent";
import { FormSection } from "@/components/forms/form-section";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { JsonEditor } from "json-edit-react";
import { EntityFieldControl } from "@/lib/types/field-control";
import { Agent } from "@/utils/api/types";

export interface AgentFormProps {
  agent?: Partial<Agent>;
  onSubmit: (data: AgentFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function AgentForm({
  agent,
  onSubmit,
  isLoading,
  error,
  fieldControl,
}: AgentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: agent?.name || "",
      role: agent?.role || "",
      goal: agent?.goal || "",
      backstory: agent?.backstory || "",
      memory_enabled: agent?.memory_enabled ?? true,
      verbose: agent?.verbose ?? false,
      allow_delegation: agent?.allow_delegation ?? false,
      max_iterations: agent?.max_iterations ?? 5,
      max_rpm: agent?.max_rpm ?? null,
      tools: agent?.tools || {},
      llm_config: agent?.llm_config || {},
      is_template: agent?.is_template ?? false,
      is_builtin: agent?.is_builtin ?? false,
      template_id: agent?.template_id ?? null,
      template_version: agent?.template_version ?? null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        title="Basic Information"
        description="Core details about the agent"
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
          <Input {...register("name")} placeholder="e.g., Research Assistant" />
        </FormField>

        <FormField
          label="Role"
          required
          section="BASIC"
          field="role"
          fieldControl={fieldControl}
          error={errors.role?.message}
        >
          <Input {...register("role")} placeholder="e.g., Researcher" />
        </FormField>

        <FormField
          label="Goal"
          required
          section="BASIC"
          field="goal"
          fieldControl={fieldControl}
          error={errors.goal?.message}
        >
          <Textarea
            {...register("goal")}
            placeholder="e.g., To gather and analyze information efficiently"
          />
        </FormField>

        <FormField
          label="Backstory"
          section="BASIC"
          field="backstory"
          fieldControl={fieldControl}
          error={errors.backstory?.message}
        >
          <Textarea
            {...register("backstory")}
            placeholder="Optional backstory for the agent..."
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Configuration"
        description="Agent behavior settings"
        collapsible
        defaultExpanded
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Memory Enabled"
            section="CONFIG"
            field="memory_enabled"
            fieldControl={fieldControl}
            error={errors.memory_enabled?.message}
          >
            <Switch
              checked={Boolean(agent?.memory_enabled)}
              onCheckedChange={(checked) => setValue("memory_enabled", checked)}
            />
          </FormField>

          <FormField
            label="Verbose"
            section="CONFIG"
            field="verbose"
            fieldControl={fieldControl}
            error={errors.verbose?.message}
          >
            <Switch
              checked={Boolean(agent?.verbose)}
              onCheckedChange={(checked) => setValue("verbose", checked)}
            />
          </FormField>

          <FormField
            label="Allow Delegation"
            section="CONFIG"
            field="allow_delegation"
            fieldControl={fieldControl}
            error={errors.allow_delegation?.message}
          >
            <Switch
              checked={Boolean(agent?.allow_delegation)}
              onCheckedChange={(checked) => setValue("allow_delegation", checked)}
            />
          </FormField>

          <FormField
            label="Max Iterations"
            section="CONFIG"
            field="max_iterations"
            fieldControl={fieldControl}
            error={errors.max_iterations?.message}
          >
            <Input
              type="number"
              min={1}
              {...register("max_iterations", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Max RPM"
            section="CONFIG"
            field="max_rpm"
            fieldControl={fieldControl}
            error={errors.max_rpm?.message}
          >
            <Input
              type="number"
              min={0}
              {...register("max_rpm", { valueAsNumber: true })}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Advanced Configuration"
        description="Tools and LLM settings"
        collapsible
        defaultExpanded={false}
      >
        <FormField
          label="Tools Configuration"
          section="ADVANCED"
          field="tools"
          fieldControl={fieldControl}
          error={errors.tools?.message}
        >
          <div className="border rounded-md p-4 bg-secondary">
            <JsonEditor
              data={agent?.tools || {}}
              setData={(data) => setValue("tools", data)}
            />
          </div>
        </FormField>

        <FormField
          label="LLM Configuration"
          section="ADVANCED"
          field="llm_config"
          fieldControl={fieldControl}
          error={errors.llm_config?.message}
        >
          <div className="border rounded-md p-4 bg-secondary">
            <JsonEditor
              data={agent?.llm_config || {}}
              setData={(data) => setValue("llm_config", data)}
            />
          </div>
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