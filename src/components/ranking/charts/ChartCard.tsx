
import React, { ReactNode, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff, Search } from 'lucide-react';

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
  showAnalysis = false
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Format value - replace dot with comma for decimal numbers
  const formatDisplayValue = (val: string | number): string => {
    const stringVal = val.toString();
    return stringVal.replace('.', ',');
  };

  return (
    <Card 
      className={`overflow-hidden border border-blue-200 hover:shadow-md transition-all bg-white rounded-xl ${className} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-0">
        <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
          <div>
            <h3 className="text-sm sm:text-base font-medium text-gray-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
            {isLoading ? (
              <Skeleton className="h-6 w-28 mt-1 bg-blue-100" />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl font-semibold text-blue-700">
                  {formatDisplayValue(value)}
                </p>
                {trendIndicator && trendIndicator}
              </div>
            )}
          </div>
          
          {/* Action buttons that appear on hover */}
          <div className={`flex space-x-2 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            {onToggleAnalysis && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAnalysis();
                }}
                className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
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
                className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                title="Ocultar card"
              >
                <EyeOff size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="p-4 h-[250px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Skeleton className="h-[200px] w-full rounded-md bg-blue-50" />
              <div className="mt-2 text-blue-400 text-sm animate-pulse">
                Carregando dados...
              </div>
            </div>
          ) : showAnalysis && analysis ? (
            <div className="w-full h-full overflow-auto bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-700 mb-2">Análise de dados</h4>
              <p className="text-sm text-gray-700">{analysis}</p>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">{children}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
