import { LLMFormData } from "@/lib/schemas/llm";
import { BaseCard } from "@/components/cards/base-card";
import { CardField } from "@/components/cards/card-field";
import { EntityFieldControl } from "@/lib/types/field-control";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface LLMCardProps {
  llm: LLMFormData;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function LLMCard({
  llm,
  onEdit,
  onDelete,
  isLoading,
  error,
  fieldControl,
}: LLMCardProps) {
  const actions = (
    <div className="flex space-x-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-gray-500 hover:text-gray-700"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-gray-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <BaseCard
      title={llm.name}
      actions={actions}
      isLoading={isLoading}
      error={error}
    >
      <div className="space-y-4">
        <CardField
          label="Provider"
          value={llm.provider}
          section="BASIC"
          field="provider"
          fieldControl={fieldControl}
        />

        <CardField
          label="Models"
          value={llm.models.join(", ")}
          section="BASIC"
          field="models"
          fieldControl={fieldControl}
        />
      </div>
    </BaseCard>
  );
}
