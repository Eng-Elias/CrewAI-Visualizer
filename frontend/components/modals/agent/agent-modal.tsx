import { useState } from "react";
import { BaseModal } from "@/components/modals/base-modal";
import { AgentForm } from "@/components/forms/agent/agent-form";
import { AgentView } from "@/components/cards/agent/agent-view";
import { Agent } from "@/utils/api/types";
import { AgentFormData } from "@/lib/schemas/agent";
import { EntityFieldControl } from "@/lib/types/field-control";

export interface AgentModalProps {
  agent: Agent;
  isOpen: boolean;
  isEditable?: boolean;
  onClose: () => void;
  onUpdate: (data: AgentFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function AgentModal({
  agent,
  isOpen,
  isEditable = true,
  onClose,
  onUpdate,
  onDelete,
  isLoading,
  error,
  fieldControl,
}: AgentModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (data: AgentFormData) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      // Error will be handled by the parent component
      console.error("Failed to update agent:", error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Agent" : "Agent Details"}
      maxWidth="2xl"
    >
      {isEditing && isEditable ? (
        <AgentForm
          agent={agent}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          fieldControl={fieldControl}
        />
      ) : (
        <AgentView
          agent={agent}
          onEditButtonClick={isEditable ? handleEdit : undefined}
          onDeleteButtonClick={isEditable ? onDelete : undefined}
          isLoading={isLoading}
          error={error}
          fieldControl={fieldControl}
        />
      )}
    </BaseModal>
  );
}
