
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp, BarChart3, X } from 'lucide-react';

interface SortableChartCardProps {
  id: string;
  component: React.ReactNode;
  title: string;
  analysis: string;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  disableCardContainer?: boolean;
}

const SortableChartCard: React.FC<SortableChartCardProps> = ({
  id,
  component,
  title,
  analysis,
  isVisible,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  disableCardContainer = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // If the card is not visible, return null
  if (!isVisible) return null;
  
  // If disableCardContainer is true, just render the component without the card wrapper
  if (disableCardContainer) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="sortable-chart-card"
        {...attributes}
        {...listeners}
      >
        {component}
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="sortable-chart-card"
      {...attributes}
      {...listeners}
    >
      <Card className="bg-white shadow-sm border-gray-200 overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header with title and controls */}
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white/80">
          <div className="font-medium text-gray-700 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            <span>{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {!showAnalysisOnly && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleAnalysis}
                className="h-7 w-7 text-gray-500 hover:text-orange-500"
              >
                {isAnalysisExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleView}
              className="h-7 w-7 text-gray-500 hover:text-orange-500"
              title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar apenas análise"}
            >
              {showAnalysisOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="h-7 w-7 text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Analysis section */}
        {isAnalysisExpanded && (
          <div className="p-3 border-b border-gray-100 bg-orange-50 text-sm text-gray-700">
            {analysis}
          </div>
        )}
        
        {/* Chart content */}
        {!showAnalysisOnly && (
          <div className="p-4 bg-white">
            {component}
          </div>
        )}
        
        {/* Only show analysis in this view mode */}
        {showAnalysisOnly && (
          <div className="p-4 bg-white text-sm text-gray-700">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-700 mb-2">Análise:</h4>
              {analysis}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SortableChartCard;
