
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartAnalysisProps {
  title: string;
  analysis: string;
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ title, analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-2 relative">
      {/* Position the button in the top right of the chart card */}
      <div className="absolute top-0 right-0 p-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-8 h-8 bg-white text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors shadow-sm"
          onClick={() => console.log(`Visualizar detalhes de ${title}`)}
        >
          <ArrowUpRight size={16} />
        </Button>
      </div>

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
    </div>
  );
};

export default ChartAnalysis;
