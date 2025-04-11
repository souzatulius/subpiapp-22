
import React from 'react';
import { Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';

export type LoadingState = 'loading' | 'refreshing' | 'error' | 'empty' | 'idle';

interface ChartLoadingOverlayProps {
  state: LoadingState;
  message?: string;
  errorMessage?: string;
  className?: string;
  isTransparent?: boolean;
}

const ChartLoadingOverlay: React.FC<ChartLoadingOverlayProps> = ({
  state,
  message,
  errorMessage = 'Ocorreu um erro ao carregar os dados',
  className = '',
  isTransparent = true
}) => {
  if (state === 'idle') return null;
  
  const defaultMessages = {
    loading: 'Carregando dados...',
    refreshing: 'Atualizando gráfico...',
    error: errorMessage,
    empty: 'Sem dados para exibir'
  };
  
  const displayMessage = message || defaultMessages[state];
  
  const renderIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />;
      case 'refreshing':
        return <RefreshCcw className="h-6 w-6 text-orange-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'empty':
        return <div className="h-6 w-6 rounded-full border-2 border-gray-300" />;
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    if (!isTransparent) return 'bg-white';
    return state === 'error' ? 'bg-red-50/90' : 'bg-white/80';
  };
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center ${getBgColor()} z-10 ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {renderIcon()}
        <p className={`text-sm font-medium ${state === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default ChartLoadingOverlay;
