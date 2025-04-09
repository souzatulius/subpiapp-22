
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartAnalysisProps {
  title: string;
  analysis: string;
  onToggleView?: () => void;
  isFullAnalysisMode?: boolean;
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ 
  title, 
  analysis, 
  onToggleView,
  isFullAnalysisMode = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="mt-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Position the button in the top right of the chart card */}
      <div className={`absolute top-0 right-0 p-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {onToggleView && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-8 h-8 bg-white text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors shadow-sm"
            onClick={onToggleView}
            title={isFullAnalysisMode ? "Ver gráfico" : "Ver análise completa"}
          >
            {isFullAnalysisMode ? <BarChart2 size={16} /> : <ArrowUpRight size={16} />}
          </Button>
        )}
      </div>

      {!isFullAnalysisMode && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-2 text-sm text-orange-600 hover:text-orange-800 transition-colors"
          >
            <span>Análise</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-600 p-2 bg-orange-50 rounded-md"
            >
              {analysis}
            </motion.div>
          )}
        </>
      )}
      
      {isFullAnalysisMode && (
        <div className="p-4 bg-orange-50 rounded-lg mt-2">
          <h3 className="font-medium text-orange-800 mb-2">Análise completa</h3>
          <p className="text-sm text-gray-700">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default ChartAnalysis;
