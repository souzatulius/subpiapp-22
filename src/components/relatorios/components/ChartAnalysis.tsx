
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartAnalysisProps {
  analysis: string;
  isExpanded?: boolean;
}

export const ChartAnalysis: React.FC<ChartAnalysisProps> = ({ 
  analysis, 
  isExpanded = false 
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);

  // Update state when prop changes
  React.useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  // Toggle expansion
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="border-t border-gray-100">
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
        onClick={toggleExpanded}
      >
        <span>Análise</span>
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>
      
      <div 
        className={cn(
          "px-4 pb-3 text-xs text-gray-600 overflow-hidden transition-all duration-300",
          expanded ? "max-h-96" : "max-h-0"
        )}
      >
        <p className={expanded ? "" : "hidden"}>{analysis}</p>
      </div>
    </div>
  );
};
