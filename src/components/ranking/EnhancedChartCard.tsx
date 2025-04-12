
import React, { useState, useEffect } from 'react';
import { Loader2, Search, EyeOff } from 'lucide-react';
import { setLoading } from './charts/ChartRegistration';
import ChartLoadingOverlay, { LoadingState } from './charts/ChartLoadingOverlay';
import { motion, AnimatePresence } from 'framer-motion';

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
  subtitle?: string;
  analysis?: string;
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
  onToggleVisibility,
  subtitle,
  analysis
}) => {
  const [showLoading, setShowLoading] = useState<boolean>(isLoading);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
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

  // Toggle analysis view locally if no external handler provided
  const handleToggleAnalysis = () => {
    if (onToggleAnalysis) {
      onToggleAnalysis();
    } else if (analysis) {
      setShowAnalysis(!showAnalysis);
    }
  };

  return (
    <motion.div 
      className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-3 relative">
        <div>
          <h3 className="font-medium text-sm text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-2">
          {dataSource && (
            <span className={`text-xs py-0.5 px-2 rounded-full border ${getBadgeColor(dataSource)}`}>
              {dataSource}
            </span>
          )}
          
          {/* Control buttons shown on hover */}
          <AnimatePresence>
            {isHovered && !isLoading && (
              <motion.div 
                className="flex items-center space-x-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {showLoading && (
                  <div className="flex items-center space-x-1">
                    <Loader2 size={16} className="text-orange-500 animate-spin" />
                    <span className="text-xs text-orange-500">Atualizando...</span>
                  </div>
                )}
                
                {(onToggleAnalysis || analysis) && (
                  <button
                    onClick={handleToggleAnalysis}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title={showAnalysis ? "Mostrar gráfico" : "Ver análise interpretativa"}
                  >
                    <Search size={16} />
                  </button>
                )}
                
                {onToggleVisibility && (
                  <button
                    onClick={onToggleVisibility}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    title="Ocultar gráfico"
                  >
                    <EyeOff size={16} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
        
        <AnimatePresence mode="wait">
          {showAnalysis && analysis ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-orange-50 rounded-xl p-4 min-h-[200px]"
            >
              <h4 className="font-medium text-orange-800 mb-2">Análise do gráfico</h4>
              <p className="text-sm text-gray-700">{analysis}</p>
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedChartCard;
