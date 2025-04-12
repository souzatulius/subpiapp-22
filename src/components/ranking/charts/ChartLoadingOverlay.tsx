
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

export type LoadingState = 'idle' | 'loading' | 'error';

interface ChartLoadingOverlayProps {
  state: LoadingState;
  message?: string;
  errorMessage?: string;
}

const ChartLoadingOverlay: React.FC<ChartLoadingOverlayProps> = ({
  state,
  message = 'Carregando dados...',
  errorMessage = 'Erro ao carregar dados'
}) => {
  if (state === 'idle') return null;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10 rounded-xl">
      {state === 'loading' && (
        <>
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin mb-2" />
          <p className="text-sm text-gray-700">{message}</p>
        </>
      )}
      
      {state === 'error' && (
        <>
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
        </>
      )}
    </div>
  );
};

export default ChartLoadingOverlay;
