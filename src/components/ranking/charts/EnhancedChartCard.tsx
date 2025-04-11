
import React, { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EyeOff, Search } from 'lucide-react';

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
  footerContent
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className={`border border-orange-200 shadow-sm hover:shadow-md transition-all relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
