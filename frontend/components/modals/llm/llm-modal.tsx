import { useState } from "react";
import { LLMFormData } from "@/lib/schemas/llm";
import { BaseModal } from "@/components/modals/base-modal";
import { LLMForm } from "@/components/forms/llm/llm-form";
import { EntityFieldControl } from "@/lib/types/field-control";
import { LLM } from "@/utils/api";

export interface LLMModalProps {
  llm?: Partial<LLM>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: LLMFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldControl?: EntityFieldControl;
}

export function LLMModal({
  llm,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isLoading,
  error,
  fieldControl,
}: LLMModalProps) {
  const [isEditing, setIsEditing] = useState(!llm);

  const handleUpdate = async (data: LLMFormData) => {
    await onUpdate(data);
    setIsEditing(false);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={llm ? "Edit LLM" : "New LLM"}
      description={
        llm ? "Update the LLM configuration" : "Create a new LLM configuration"
      }
    >
      {isEditing ? (
        <LLMForm
          llm={llm}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          error={error}
          fieldControl={fieldControl}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 text-sm text-gray-900">{llm?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <div className="mt-1 text-sm text-gray-900">{llm?.provider}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model Name
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {llm?.models?.join(", ")}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperature
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {llm?.temperature}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Tokens
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {llm?.max_tokens}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
}
