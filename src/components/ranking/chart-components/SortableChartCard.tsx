
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Search, EyeOff, GripVertical } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface SortableChartCardProps {
  id: string;
  component: React.ReactNode;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  title?: string;
  analysis: string;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  disableCardContainer?: boolean;
}

const SortableChartCard: React.FC<SortableChartCardProps> = ({
  id,
  component,
  isVisible,
  isAnalysisExpanded,
  showAnalysisOnly,
  title,
  analysis,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  disableCardContainer = false
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  
  // If the chart should not be visible, don't render anything
  if (!isVisible) return null;
  
  // If the card container is disabled, just render the component
  if (disableCardContainer) {
    return <div ref={setNodeRef} style={style}>{component}</div>;
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative h-full rounded-xl"
    >
      <Card className="border border-gray-200 bg-white shadow-sm h-full rounded-xl overflow-hidden">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-medium text-gray-800">{title}</h3>
            </div>
            
            {/* Drag handle - only visible when hovering */}
            <div 
              {...attributes} 
              {...listeners}
              className={`cursor-grab active:cursor-grabbing transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            >
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
        
        <CardContent className="p-0 relative">
          {/* Action buttons - only visible on hover */}
          <div 
            className={`absolute top-3 right-3 z-10 flex space-x-2 transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          >
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  onClick={onToggleAnalysis}
                  className="p-1.5 rounded-full bg-white hover:bg-gray-100 text-orange-500 hover:text-orange-600 border border-gray-200 shadow-sm transition-colors"
                  aria-label="Ver análise"
                >
                  <Search size={16} />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-2 text-xs">
                Alternar entre visualização de análise e gráfico
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  onClick={onToggleVisibility}
                  className="p-1.5 rounded-full bg-white hover:bg-gray-100 text-orange-500 hover:text-orange-600 border border-gray-200 shadow-sm transition-colors"
                  aria-label="Esconder"
                >
                  <EyeOff size={16} />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-2 text-xs">
                Ocultar este gráfico do dashboard
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Chart or Analysis */}
          <div>
            {showAnalysisOnly ? (
              <div className="p-4 bg-gray-50 min-h-[250px] rounded-b-xl">
                <h4 className="font-medium text-gray-800 mb-2">Análise:</h4>
                <p className="text-sm text-gray-600">{analysis}</p>
              </div>
            ) : (
              component
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableChartCard;
