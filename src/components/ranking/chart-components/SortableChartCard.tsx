
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Eye, EyeOff, FileText, LayoutDashboard } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

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

const analysisVariants = cva(
  "text-sm border-t transition-all overflow-hidden",
  {
    variants: {
      state: {
        expanded: "max-h-64 py-3 px-4 border-blue-100 bg-blue-50",
        collapsed: "max-h-0 py-0 px-0 border-transparent"
      }
    },
    defaultVariants: {
      state: "collapsed"
    }
  }
);

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
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // If the card is not visible, don't render anything
  if (!isVisible) return null;

  if (disableCardContainer) {
    return <>{component}</>;
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={cn(
          "border border-blue-200 hover:shadow-md transition-all overflow-hidden",
          showAnalysisOnly ? "bg-blue-50" : "bg-white"
        )} 
      >
        <CardContent className="p-0">
          {title && (
            <div className="p-3 flex justify-between items-center border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
              <h3 className="text-sm font-medium text-gray-800 flex items-center">
                {showAnalysisOnly ? (
                  <FileText className="h-4 w-4 mr-2 text-blue-700" />
                ) : (
                  <LayoutDashboard className="h-4 w-4 mr-2 text-blue-700" />
                )}
                {title}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleView();
                  }}
                  className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar apenas análise"}
                >
                  {showAnalysisOnly ? <LayoutDashboard size={14} /> : <FileText size={14} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAnalysis();
                  }}
                  className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  title={isAnalysisExpanded ? "Ocultar análise" : "Exibir análise"}
                >
                  {isAnalysisExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility();
                  }}
                  className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Ocultar card"
                >
                  <EyeOff size={14} />
                </button>
              </div>
            </div>
          )}
          
          {/* Analysis section - shown either expanded or when in analysis-only mode */}
          {(isAnalysisExpanded || showAnalysisOnly) && (
            <div className={analysisVariants({ state: "expanded" })}>
              {analysis}
            </div>
          )}
          
          {/* Chart content - only show if not in analysis-only mode */}
          {!showAnalysisOnly && (
            <div className="p-3">
              {component}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableChartCard;
