import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EntityFieldControl } from "@/lib/types/field-control";
import { shouldShowField } from "@/lib/ui-utils/field-control";

export interface CardFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
  section: string;
  field: string;
  fieldControl?: EntityFieldControl;
}

export function CardField({
  label,
  value,
  className,
  section,
  field,
  fieldControl,
}: CardFieldProps) {
  if (!shouldShowField(fieldControl, section, field)) {
    return null;
  }

  return (
    <div className={cn("space-y-1", className)}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">
        {value ?? <span className="text-gray-400">Not set</span>}
      </dd>
    </div>
  );
}
