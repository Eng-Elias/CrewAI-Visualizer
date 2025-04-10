import { BaseModal } from "@/components/modals/base-modal";
import { AgentForm } from "@/components/forms/agent/agent-form";
import { AgentFormData } from "@/lib/schemas/agent";
import { EntityFieldControl } from "@/lib/types/field-control";

export interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: AgentFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function NewAgentModal({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
  fieldControl,
}: NewAgentModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Agent"
      maxWidth="2xl"
    >
      <AgentForm
        onSubmit={onCreate}
        isLoading={isLoading}
        error={error}
        fieldControl={fieldControl}
      />
    </BaseModal>
  );
} 