import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeOff, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    switch (source.toLowerCase()) {
      case 'sgz':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'painel da zeladoria':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  return <Card className={`border border-orange-200 shadow-sm hover:shadow-md transition-all relative ${className}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
              
              {/* Data source badge moved to right side */}
              {dataSource && <Badge variant="outline" className={`text-xs py-0 px-1.5 ml-2 ${getBadgeColor(dataSource)}`}>
                  {dataSource}
                </Badge>}
            </div>
            
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {value !== undefined && <p className="font-semibold mt-1 text-orange-600 text-2xl">{value}</p>}
          </div>
          
          {/* Action buttons on header with updated styling */}
          <div className="flex space-x-1 ml-2">
            {onToggleAnalysis && <button onClick={e => {
            e.stopPropagation();
            onToggleAnalysis();
          }} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" title="Mostrar análise">
                <Search size={16} />
              </button>}
            
            {onToggleVisibility && <button onClick={e => {
            e.stopPropagation();
            onToggleVisibility();
          }} title="Ocultar card" className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors py-[5px]">
                <EyeOff size={16} />
              </button>}
          </div>
          
          {headerContent}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {isLoading ? <div className="flex items-center justify-center h-[220px]">
            <Skeleton className="h-[200px] w-[200px]" />
          </div> : <div className="h-[220px]">
            {children}
          </div>}
        
        {footerContent && <div className="mt-3">
            {footerContent}
          </div>}
      </CardContent>
    </Card>;
};
export default EnhancedChartCard;