import { ReactNode } from "react";
import { BaseCard } from "@/components/cards/base-card";
import { CardField } from "@/components/cards/card-field";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Agent } from "@/utils/api/types";
import { EntityFieldControl } from "@/lib/types/field-control";

export interface AgentViewProps {
  agent: Agent;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function AgentView({
  agent,
  onEditButtonClick,
  onDeleteButtonClick,
  isLoading,
  error,
}: AgentViewProps) {
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
        title={agent.name}
        description={agent.role}
        actions={actions}
        isLoading={isLoading}
        error={error}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <CardField
              label="Goal"
              value={agent.goal}
              section="BASIC"
              field="goal"
            />
            {agent.backstory && (
              <CardField
                label="Backstory"
                value={agent.backstory}
                section="BASIC"
                field="backstory"
              />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CardField
              label="Memory Enabled"
              value={agent.memory_enabled ? "Yes" : "No"}
              section="CONFIG"
              field="memory_enabled"
            />
            <CardField
              label="Verbose"
              value={agent.verbose ? "Yes" : "No"}
              section="CONFIG"
              field="verbose"
            />
            <CardField
              label="Allow Delegation"
              value={agent.allow_delegation ? "Yes" : "No"}
              section="CONFIG"
              field="allow_delegation"
            />
            <CardField
              label="Max Iterations"
              value={String(agent.max_iterations)}
              section="CONFIG"
              field="max_iterations"
            />
            {agent.max_rpm && (
              <CardField
                label="Max RPM"
                value={String(agent.max_rpm)}
                section="CONFIG"
                field="max_rpm"
              />
            )}
          </div>
        </div>
      </BaseCard>

      {agent.is_template && (
        <BaseCard title="Template Information">
          <div className="grid gap-4 md:grid-cols-2">
            <CardField
              label="Is Template"
              value={agent.is_template ? "Yes" : "No"}
              section="TEMPLATE"
              field="is_template"
            />
            <CardField
              label="Is Built-in"
              value={agent.is_builtin ? "Yes" : "No"}
              section="TEMPLATE"
              field="is_builtin"
            />
            {agent.template_id && (
              <CardField
                label="Template ID"
                value={String(agent.template_id)}
                section="TEMPLATE"
                field="template_id"
              />
            )}
            {agent.template_version && (
              <CardField
                label="Template Version"
                value={String(agent.template_version)}
                section="TEMPLATE"
                field="template_version"
              />
            )}
          </div>
        </BaseCard>
      )}
    </div>
  );
}
