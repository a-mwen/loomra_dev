import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        {icon || <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />}
      </div>
      
      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;