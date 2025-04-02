import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp, LineChart, BarChart } from 'lucide-react';

interface SortableChartCardProps {
  id: string;
  title: string;
  analysis: string;
  component: React.ReactNode;
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
  title,
  analysis,
  component,
  isVisible,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  disableCardContainer = false
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // If card should not be visible, return null
  if (!isVisible) return null;
  
  // If disableCardContainer is true, render just the component without the card wrapper
  if (disableCardContainer) {
    return (
      <div ref={setNodeRef} style={style}>
        {component}
      </div>
    );
  }
  
  // Otherwise, render the full card
  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`h-full overflow-hidden transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
        <CardHeader className="p-3 flex flex-row items-center justify-between bg-gray-50">
          <CardTitle className="text-sm font-medium flex items-center cursor-grab" {...attributes} {...listeners}>
            {showAnalysisOnly ? <LineChart className="h-4 w-4 mr-2" /> : <BarChart className="h-4 w-4 mr-2" />}
            {title}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleView} title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar apenas análise"}>
              {showAnalysisOnly ? <BarChart className="h-4 w-4" /> : <LineChart className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleAnalysis} title={isAnalysisExpanded ? "Recolher análise" : "Expandir análise"}>
              {isAnalysisExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleVisibility} title="Ocultar gráfico">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {isAnalysisExpanded && (
            <div className="mb-3 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
              <p>{analysis}</p>
            </div>
          )}
          
          {!showAnalysisOnly && component}
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableChartCard;
