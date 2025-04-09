
import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-xl mt-4">
      <SearchX size={48} className="text-gray-400 mb-4" />
      <p className="text-gray-500 text-lg text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
