
import React from 'react';
import { Loader2 } from 'lucide-react';

export type LoadingState = 'idle' | 'loading' | 'error' | 'empty';

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
  if (state === 'idle') {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
      {state === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 size={24} className="text-orange-500 animate-spin mb-2" />
          <p className="text-sm text-orange-600">{message}</p>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {state === 'empty' && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">Sem dados disponíveis</p>
        </div>
      )}
    </div>
  );
};

export default ChartLoadingOverlay;
