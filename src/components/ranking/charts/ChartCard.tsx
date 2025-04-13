
import React, { useState } from 'react';
import EnhancedChartCard from '../EnhancedChartCard';
import { LoadingState } from './ChartLoadingOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, EyeOff } from 'lucide-react';

interface ChartCardProps {
  title: string;
  value?: string | number;
  isLoading: boolean;
  children: React.ReactNode;
  subtitle?: string;
  loadingState?: LoadingState;
  loadingMessage?: string;
  errorMessage?: string;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
  onToggleAnalysis?: () => void;
  onToggleVisibility?: () => void;
  chartRef?: React.RefObject<any>;
  className?: string;
  analysis?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  isLoading,
  children,
  subtitle,
  loadingState = 'idle',
  loadingMessage,
  errorMessage,
  dataSource,
  onToggleAnalysis,
  onToggleVisibility,
  chartRef,
  className,
  analysis
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle analysis toggle locally if no external handler provided
  const handleToggleAnalysis = () => {
    if (onToggleAnalysis) {
      onToggleAnalysis();
    } else if (analysis) {
      setShowAnalysis(!showAnalysis);
    }
  };

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action buttons on hover */}
      <AnimatePresence>
        {isHovered && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 right-2 flex space-x-1 z-10"
          >
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
                title="Ocultar este gráfico"
              >
                <EyeOff size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <EnhancedChartCard
        title={title}
        isLoading={isLoading}
        chartRef={chartRef}
        loadingState={loadingState}
        loadingMessage={loadingMessage}
        errorMessage={errorMessage}
        dataSource={dataSource}
        onToggleAnalysis={onToggleAnalysis || (analysis ? handleToggleAnalysis : undefined)}
        onToggleVisibility={onToggleVisibility}
        className={className}
        subtitle={subtitle}
        analysis={analysis}
      >
        {showAnalysis && analysis ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-orange-50 rounded-lg text-sm text-gray-700"
            >
              {analysis}
            </motion.div>
          </AnimatePresence>
        ) : (
          children
        )}
      </EnhancedChartCard>
    </motion.div>
  );
};

export default ChartCard;
