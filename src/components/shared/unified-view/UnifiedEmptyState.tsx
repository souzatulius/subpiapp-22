
import React from 'react';
import { Search, FileX, AlertCircle } from 'lucide-react';

interface UnifiedEmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  description?: string;
}

const UnifiedEmptyState: React.FC<UnifiedEmptyStateProps> = ({
  message,
  icon,
  description
}) => {
  const defaultIcon = icon || <Search className="h-12 w-12 text-gray-300" />;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        {defaultIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-1">{message}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-md">{description}</p>
      )}
    </div>
  );
};

export default UnifiedEmptyState;
