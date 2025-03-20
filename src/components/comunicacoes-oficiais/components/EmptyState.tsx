
import React from 'react';
import { EmptyStateProps } from '../types';

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
