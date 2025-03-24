import { ReactNode } from 'react';
import { EntityFieldControl } from '@/lib/types/field-control';
import { cn } from '@/lib/utils';

export interface BaseFormProps {
  title?: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  fieldControl?: EntityFieldControl;
}

export function BaseForm({
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  error,
  className,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
}: BaseFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {title && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Loading...' : submitLabel}
        </button>
      </div>
    </form>
  );
} 