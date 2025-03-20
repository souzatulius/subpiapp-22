
import React from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingStateProps } from '../types';

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;
