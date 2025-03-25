import { LLMFormData } from '@/lib/schemas/llm';
import { BaseModal } from '@/components/modals/base-modal';
import { LLMForm } from '@/components/forms/llm/llm-form';
import { EntityFieldControl } from '@/lib/types/field-control';

export interface NewLLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: LLMFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function NewLLMModal({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
  fieldControl,
}: NewLLMModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="New LLM"
      description="Create a new LLM configuration"
    >
      <LLMForm
        onSubmit={onCreate}
        isLoading={isLoading}
        error={error}
        fieldControl={fieldControl}
      />
    </BaseModal>
  );
} 