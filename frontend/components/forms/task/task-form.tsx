"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskSchema } from "@/lib/schemas/task";
import { FormSection } from "@/components/forms/form-section";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntityFieldControl } from "@/lib/types/field-control";
import { Task } from "@/utils/api/types";

export interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
  showAgentField?: boolean;
}

export function TaskForm({
  task,
  onSubmit,
  isLoading = false,
  error,
  fieldControl,
  showAgentField = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      expected_output: task?.expected_output || "",
      agent: task?.agent || null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        title="Basic Information"
        description="Core details about the task"
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
          <Input {...register("name")} placeholder="e.g., Research Task" />
        </FormField>

        <FormField
          label="Description"
          required
          section="BASIC"
          field="description"
          fieldControl={fieldControl}
          error={errors.description?.message}
        >
          <Textarea
            {...register("description")}
            placeholder="e.g., Research and analyze the given topic"
          />
        </FormField>

        <FormField
          label="Expected Output"
          required
          section="BASIC"
          field="expected_output"
          fieldControl={fieldControl}
          error={errors.expected_output?.message}
        >
          <Textarea
            {...register("expected_output")}
            placeholder="e.g., A comprehensive report with key findings"
          />
        </FormField>

        {showAgentField && (
          <FormField
            label="Agent"
            section="BASIC"
            field="agent"
            fieldControl={fieldControl}
            error={errors.agent?.message}
          >
            <Input
              type="number"
              {...register("agent", { valueAsNumber: true })}
              placeholder="Agent ID"
            />
          </FormField>
        )}
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
