import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className = '',
  footer,
  headerAction,
  noPadding = false
}) => {
  const paddingClass = noPadding ? '' : 'p-6';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-card border border-gray-200 dark:border-gray-700 ${className}`}>
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={paddingClass}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;