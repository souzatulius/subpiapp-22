
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ChartAnalysisProps {
  title: string;
  analysis: string;
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ title, analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 text-sm text-orange-600 hover:text-orange-800 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <Info className="h-3.5 w-3.5 mr-1" />
          <span>Análise</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="text-xs text-gray-600 p-2 pt-0 bg-orange-50/50 rounded-md">
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default ChartAnalysis;
