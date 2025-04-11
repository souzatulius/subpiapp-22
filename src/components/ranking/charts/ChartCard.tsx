
import React, { ReactNode, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EyeOff, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InsufficientDataMessage from './InsufficientDataMessage';
import ChartLoadingOverlay, { LoadingState } from './ChartLoadingOverlay';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  isLoading: boolean;
  children: ReactNode;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  className?: string;
  isDraggable?: boolean;
  trendIndicator?: ReactNode;
  analysis?: string;
  showAnalysis?: boolean;
  hasData?: boolean;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  loadingState?: LoadingState;
  loadingMessage?: string;
  errorMessage?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  subtitle,
  value, 
  isLoading, 
  children,
  onToggleVisibility,
  onToggleAnalysis,
  className = '',
  isDraggable = true,
  trendIndicator,
  analysis,
  showAnalysis = false,
  hasData = true,
  dataSource,
  loadingState = 'idle',
  loadingMessage,
  errorMessage
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Format value - replace dot with comma for decimal numbers
  const formatDisplayValue = (val: string | number): string => {
    const stringVal = val.toString();
    return stringVal.replace('.', ',');
  };

  // Generate badge color based on data source
  const getBadgeColor = (source?: string) => {
    if (!source) return 'bg-gray-200 text-gray-700';
    
    switch(source?.toLowerCase()) {
      case 'sgz':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'painel da zeladoria':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Determine the actual loading state
  const actualLoadingState: LoadingState = loadingState !== 'idle' 
    ? loadingState 
    : isLoading ? 'loading' : !hasData ? 'empty' : 'idle';

  return (
    <Card 
      className={`overflow-hidden border border-blue-200 hover:shadow-md transition-all bg-white rounded-xl ${className} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-0">
        <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-800">{title}</h3>
              
              {dataSource && (
                <Badge 
                  variant="outline" 
                  className={`text-xs py-0 px-1.5 ml-2 ${getBadgeColor(dataSource)}`}
                >
                  {dataSource}
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
            
            {isLoading ? (
              <div className="h-6 flex items-center animate-pulse">
                <div className="h-5 w-28 bg-blue-100 rounded"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl font-semibold text-blue-700">
                  {formatDisplayValue(value)}
                </p>
                {trendIndicator && trendIndicator}
              </div>
            )}
          </div>
          
          {/* Action buttons moved to header */}
          <div className="flex space-x-2 ml-2">
            {onToggleAnalysis && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAnalysis();
                }}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Mostrar análise"
              >
                <Search size={16} />
              </button>
            )}
            
            {onToggleVisibility && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                title="Ocultar card"
              >
                <EyeOff size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="p-4 h-[250px] flex items-center justify-center relative">
          {actualLoadingState !== 'idle' && (
            <ChartLoadingOverlay 
              state={actualLoadingState}
              message={loadingMessage}
              errorMessage={errorMessage}
              className="rounded-md"
            />
          )}
          {showAnalysis && analysis ? (
            <div className="w-full h-full overflow-auto bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-700 mb-2">Análise de dados</h4>
              <p className="text-sm text-gray-700">{analysis}</p>
            </div>
          ) : !hasData && actualLoadingState === 'idle' ? (
            <InsufficientDataMessage />
          ) : (
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              {typeof children === 'string' ? children : children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
