
import React from 'react';
import { SearchX } from 'lucide-react';

interface UnifiedEmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const UnifiedEmptyState: React.FC<UnifiedEmptyStateProps> = ({
  message = "Nenhum resultado encontrado",
  description,
  icon,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        {icon || <SearchX className="h-8 w-8 text-gray-500" />}
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">{message}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
};

export default UnifiedEmptyState;
