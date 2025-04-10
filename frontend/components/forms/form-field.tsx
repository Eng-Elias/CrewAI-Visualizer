import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EntityFieldControl } from "@/lib/types/field-control";
import { shouldShowField, isFieldReadOnly } from "@/lib/ui-utils/field-control";

export interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  section: string;
  field: string;
  fieldControl?: EntityFieldControl;
}

export function FormField({
  label,
  description,
  error,
  children,
  className,
  required,
  section,
  field,
  fieldControl,
}: FormFieldProps) {
  if (!shouldShowField(fieldControl, section, field)) {
    return null;
  }

  const isReadOnly = isFieldReadOnly(fieldControl, section, field);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isReadOnly && <span className="text-xs text-gray-500">Read-only</span>}
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      <div className={cn(isReadOnly && "opacity-60 pointer-events-none")}>
        {children}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
