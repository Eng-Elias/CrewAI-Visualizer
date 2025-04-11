import { ReactNode } from "react";
import { BaseCard } from "@/components/cards/base-card";
import { CardField } from "@/components/cards/card-field";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { Agent } from "@/utils/api/types";
import { EntityFieldControl } from "@/lib/types/field-control";
import { useAuth } from "@/lib/auth/provider";
// import { Badge } from "@/components/ui/badge";

export interface AgentCardProps {
  agent: Agent;
  onViewButtonClick?: () => void;
  onEditButtonClick?: () => void;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function AgentCard({
  agent,
  onViewButtonClick,
  onEditButtonClick,
  isLoading,
  error,
}: AgentCardProps) {
  const { user } = useAuth();
  const actions: ReactNode = (
    <>
      {onEditButtonClick && agent.user_id === user?.id ? (
        <Button variant="ghost" size="sm" onClick={onEditButtonClick}>
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={onViewButtonClick}>
          <Eye className="h-4 w-4" />
        </Button>
      )}
    </>
  );

  return (
    <BaseCard
      title={agent.name}
      description={agent.role}
      actions={actions}
      isLoading={isLoading}
      error={error}
    >
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

        {/* {agent.tools && Object.keys(agent.tools).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tools</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(agent.tools).map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </BaseCard>
  );
}
