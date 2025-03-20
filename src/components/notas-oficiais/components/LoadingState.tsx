
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Carregando..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;
