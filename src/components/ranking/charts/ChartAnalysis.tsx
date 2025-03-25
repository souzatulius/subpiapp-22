
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChartAnalysisProps {
  title: string;
  analysis: string;
}

const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ title, analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-md">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-sm font-medium text-orange-800">Análise: {title}</p>
        <button className="text-orange-600 hover:text-orange-800">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 text-sm text-gray-700 animate-fadeInUp">
          {analysis}
        </div>
      )}
    </div>
  );
};

export default ChartAnalysis;
