
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Carregando..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <span className="text-blue-600 font-medium text-lg">{message}</span>
    </div>
  );
};

export default LoadingIndicator;
