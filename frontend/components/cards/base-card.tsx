import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BaseCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  error?: string;
}

export function BaseCard({
  title,
  description,
  children,
  className,
  actions,
  footer,
  isLoading,
  error,
}: BaseCardProps) {
  return (
    <div className={cn('rounded-lg border bg-white shadow', className)}>
      {(title || description || actions) && (
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && <h3 className="text-lg font-medium">{title}</h3>}
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            {actions && <div className="flex space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className="border-t px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
} 