
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EyeOff, Eye, GripVertical, ChevronDown, ChevronUp, LineChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SortableChartCardProps {
  id: string;
  title: string;
  component: React.ReactNode;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  analysis: string;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
}

const SortableChartCard: React.FC<SortableChartCardProps> = ({
  id,
  title,
  component,
  isVisible,
  isAnalysisExpanded,
  showAnalysisOnly,
  analysis,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-orange-200 shadow-sm overflow-hidden transition-all hover:shadow",
        !isVisible && "opacity-60"
      )}
    >
      <div className="p-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onToggleView}
            title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar apenas análise"}
          >
            {showAnalysisOnly ? (
              <LineChart className="h-4 w-4 text-orange-500" />
            ) : (
              <FileText className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onToggleAnalysis}
            title={isAnalysisExpanded ? "Ocultar análise" : "Mostrar análise"}
          >
            {isAnalysisExpanded ? (
              <ChevronUp className="h-4 w-4 text-orange-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onToggleVisibility}
            title={isVisible ? "Ocultar gráfico" : "Mostrar gráfico"}
          >
            {isVisible ? (
              <Eye className="h-4 w-4 text-gray-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-orange-500" />
            )}
          </Button>
        </div>
      </div>
      
      {isAnalysisExpanded && (
        <div className="p-3 bg-orange-50 border-b border-orange-100 text-sm text-orange-800">
          {analysis}
        </div>
      )}
      
      {isVisible && !showAnalysisOnly && (
        <CardContent className="p-0">
          <div className="p-4 h-[250px]">
            {component}
          </div>
        </CardContent>
      )}
      
      {(!isVisible || showAnalysisOnly) && !isAnalysisExpanded && (
        <div className="p-6 text-center text-gray-500 text-sm italic">
          {showAnalysisOnly ? "Apenas análise visível. Clique em 📊 para mostrar o gráfico." : "Gráfico oculto. Clique no ícone 👁️ para visualizar."}
        </div>
      )}
    </Card>
  );
};

export default SortableChartCard;
