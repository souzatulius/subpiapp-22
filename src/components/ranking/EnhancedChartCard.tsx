
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { setLoading } from './charts/ChartRegistration';
import ChartLoadingOverlay, { LoadingState } from './charts/ChartLoadingOverlay';

interface EnhancedChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  chartRef?: React.RefObject<any>;
  loadingState?: LoadingState;
  loadingMessage?: string;
  errorMessage?: string;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  onToggleAnalysis?: () => void;
  onToggleVisibility?: () => void;
}

const EnhancedChartCard: React.FC<EnhancedChartCardProps> = ({ 
  title, 
  children, 
  isLoading = false,
  className = '',
  chartRef,
  loadingState = 'idle',
  loadingMessage,
  errorMessage,
  dataSource,
  onToggleAnalysis,
  onToggleVisibility
}) => {
  const [showLoading, setShowLoading] = useState<boolean>(isLoading);
  
  // Update chart loading state when isLoading prop changes
  useEffect(() => {
    setShowLoading(isLoading);
    
    if (chartRef?.current) {
      setLoading(chartRef.current, isLoading);
    }
    
  }, [isLoading, chartRef]);

  // Determine the loading state
  const actualLoadingState: LoadingState = loadingState !== 'idle' 
    ? loadingState 
    : showLoading ? 'loading' : 'idle';

  // Generate badge color based on data source
  const getBadgeColor = (source?: string) => {
    if (!source) return '';
    
    switch(source.toLowerCase()) {
      case 'sgz':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'painel da zeladoria':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-gray-800">{title}</h3>
        
        <div className="flex items-center space-x-2">
          {dataSource && (
            <span className={`text-xs py-0.5 px-2 rounded-full border ${getBadgeColor(dataSource)}`}>
              {dataSource}
            </span>
          )}
          
          {/* Control buttons moved here */}
          <div className="flex items-center space-x-1">
            {showLoading && (
              <div className="flex items-center space-x-1">
                <Loader2 size={16} className="text-orange-500 animate-spin" />
                <span className="text-xs text-orange-500">Atualizando...</span>
              </div>
            )}
            
            {onToggleAnalysis && (
              <button
                onClick={onToggleAnalysis}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                title="Alternar análise"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            )}
            
            {onToggleVisibility && (
              <button
                onClick={onToggleVisibility}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                title="Ocultar gráfico"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" y1="2" x2="22" y2="22"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        {actualLoadingState !== 'idle' && (
          <ChartLoadingOverlay 
            state={actualLoadingState} 
            message={loadingMessage}
            errorMessage={errorMessage}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default EnhancedChartCard;
