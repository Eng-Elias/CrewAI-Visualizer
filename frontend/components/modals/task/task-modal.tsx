"use client";

import { useState } from "react";
import { BaseModal } from "@/components/modals/base-modal";
import { TaskForm } from "@/components/forms/task/task-form";
import { TaskView } from "@/components/cards/task/task-view";
import { Task } from "@/utils/api/types";
import { TaskFormData } from "@/lib/schemas/task";
import { EntityFieldControl } from "@/lib/types/field-control";

export interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  isEditable?: boolean;
  onClose: () => void;
  onUpdate: (data: TaskFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function TaskModal({
  task,
  isOpen,
  isEditable = true,
  onClose,
  onUpdate,
  onDelete,
  isLoading,
  error,
  fieldControl,
}: TaskModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      // Error will be handled by the parent component
      console.error("Failed to update task:", error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Task Details"}
      maxWidth="2xl"
    >
      {isEditing && isEditable ? (
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          fieldControl={fieldControl}
        />
      ) : (
        <TaskView
          task={task}
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
