
import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeOff, Search, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EnhancedChartCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  isLoading: boolean;
  children: ReactNode;
  onToggleVisibility?: () => void;
  onToggleAnalysis?: () => void;
  className?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  analysis?: string;
}

const EnhancedChartCard: React.FC<EnhancedChartCardProps> = ({ 
  title, 
  subtitle,
  value, 
  isLoading, 
  children,
  onToggleVisibility,
  onToggleAnalysis,
  className = '',
  headerContent,
  footerContent,
  dataSource,
  analysis
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // Generate badge color based on data source
  const getBadgeColor = (source?: string) => {
    if (!source) return 'bg-gray-200 text-gray-700';
    
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
    <Card 
      className={`border border-orange-200 shadow-sm hover:shadow-md transition-all relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              
              {dataSource && (
                <Badge 
                  variant="outline" 
                  className={`text-xs py-0 px-1.5 ${getBadgeColor(dataSource)}`}
                >
                  {dataSource}
                </Badge>
              )}
              
              {analysis && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-gray-400 hover:text-gray-600">
                        <Info size={14} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-60">Análise disponível</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {value !== undefined && (
              <p className="text-lg font-semibold text-blue-700 mt-1">{value}</p>
            )}
          </div>
          {headerContent}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {/* Action buttons that appear on hover */}
        <div 
          className={`absolute top-0 right-0 flex space-x-2 transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
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
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[220px]">
            <Skeleton className="h-[200px] w-[200px]" />
          </div>
        ) : (
          <div className="h-[220px]">
            {children}
          </div>
        )}
        
        {footerContent && (
          <div className="mt-3">
            {footerContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedChartCard;
