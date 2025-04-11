
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import * as ChartJS from './charts/ChartRegistration';

interface EnhancedChartCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  chartRef?: React.RefObject<any>;
}

const EnhancedChartCard: React.FC<EnhancedChartCardProps> = ({ 
  title, 
  children, 
  isLoading = false,
  className = '',
  chartRef
}) => {
  const [showLoading, setShowLoading] = useState<boolean>(isLoading);
  
  // Update chart loading state when isLoading prop changes
  useEffect(() => {
    setShowLoading(isLoading);
    
    if (chartRef?.current) {
      ChartJS.setLoading(chartRef.current, isLoading);
    }
    
  }, [isLoading, chartRef]);

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-gray-800">{title}</h3>
        {showLoading && (
          <div className="flex items-center space-x-1">
            <Loader2 size={16} className="text-orange-500 animate-spin" />
            <span className="text-xs text-orange-500">Atualizando...</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default EnhancedChartCard;
