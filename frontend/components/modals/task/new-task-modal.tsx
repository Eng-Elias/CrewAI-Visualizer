import { TaskForm } from "@/components/forms/task/task-form";
import { EntityFieldControl } from "@/lib/types/field-control";
import { BaseModal } from "../base-modal";
import { TaskFormData } from "@/lib/schemas/task";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function NewTaskModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
  error,
  fieldControl,
}: NewTaskModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      maxWidth="2xl"
    >
      <TaskForm
        onSubmit={onCreate}
        isLoading={isLoading}
        error={error}
        fieldControl={fieldControl}
      />
    </BaseModal>
  );
}
