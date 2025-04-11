"use client";

import { ReactNode } from "react";
import { BaseCard } from "@/components/cards/base-card";
import { CardField } from "@/components/cards/card-field";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Task } from "@/utils/api/types";
import { EntityFieldControl } from "@/lib/types/field-control";

interface TaskViewProps {
  task: Task;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function TaskView({
  task,
  onEditButtonClick,
  onDeleteButtonClick,
  isLoading,
  error,
}: TaskViewProps) {
  const actions: ReactNode = (
    <>
      {onEditButtonClick && (
        <Button variant="ghost" size="sm" onClick={onEditButtonClick}>
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDeleteButtonClick && (
        <Button variant="ghost" size="sm" onClick={onDeleteButtonClick}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <BaseCard
        title={task.name}
        description={task.description}
        actions={actions}
        isLoading={isLoading}
        error={error}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <CardField
              label="Expected Output"
              value={task.expected_output}
              section="BASIC"
              field="expected_output"
            />
            {task.agent && (
              <CardField
                label="Agent ID"
                value={String(task.agent)}
                section="BASIC"
                field="agent"
              />
            )}
          </div>
        </div>
      </BaseCard>

      {task.is_template && (
        <BaseCard title="Template Information">
          <div className="grid gap-4 md:grid-cols-2">
            <CardField
              label="Is Template"
              value={task.is_template ? "Yes" : "No"}
              section="TEMPLATE"
              field="is_template"
            />
            <CardField
              label="Is Built-in"
              value={task.is_builtin ? "Yes" : "No"}
              section="TEMPLATE"
              field="is_builtin"
            />
          </div>
        </BaseCard>
      )}
    </div>
  );
}
