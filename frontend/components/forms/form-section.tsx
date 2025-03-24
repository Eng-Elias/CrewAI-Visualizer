import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultExpanded = true,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      <div 
        className={cn(
          'space-y-1',
          collapsible && 'cursor-pointer select-none'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <div className="text-gray-500">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {(!collapsible || isExpanded) && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
} 