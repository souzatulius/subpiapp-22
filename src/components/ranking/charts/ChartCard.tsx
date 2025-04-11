
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDraggable } from '@dnd-kit/core';
import { ChevronDown, ChevronUp, Eye, EyeOff, BarChart2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartItem } from '../types';

interface ChartCardProps {
  chart: ChartItem;
  index: number;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  disableContainer?: boolean;
  dataSource?: 'SGZ' | 'Painel da Zeladoria' | string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  chart,
  index,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  disableContainer = false,
  dataSource
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: chart.id,
    data: { index }
  });
  
  const CardComponent = disableContainer ? React.Fragment : Card;
  const cardProps = disableContainer ? {} : { 
    className: "overflow-hidden hover:shadow-md hover:bg-orange-50 transition-all duration-200" 
  };
  
  // Generate badge color based on data source
  const getBadgeColor = (source?: string) => {
    if (!source) return 'bg-gray-200 text-gray-700';
    
    switch(source?.toLowerCase()) {
      case 'sgz':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'painel da zeladoria':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className="h-full"
    >
      <CardComponent {...cardProps}>
        <CardHeader 
          {...attributes}
          {...listeners}
          className={`${disableContainer ? 'px-0 pt-0' : ''} cursor-grab`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between flex-1">
              <CardTitle className="text-lg">{chart.title}</CardTitle>
              
              <div className="flex items-center space-x-2">
                {dataSource && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs py-0 px-1.5 ${getBadgeColor(dataSource)}`}
                  >
                    {dataSource}
                  </Badge>
                )}
                
                {/* Control buttons moved here to always be visible next to the badge */}
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={onToggleView}
                    title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar análise"}
                  >
                    {showAnalysisOnly ? (
                      <BarChart2 className="h-3.5 w-3.5" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  
                  {chart.analysis && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-gray-100 hover:bg-gray-200 text-gray-600"
                      onClick={onToggleAnalysis}
                      title={isAnalysisExpanded ? "Esconder análise" : "Mostrar análise"}
                    >
                      {isAnalysisExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    onClick={onToggleVisibility}
                    title="Esconder gráfico"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`${disableContainer ? 'px-0' : ''}`}>
          {!showAnalysisOnly && (
            <div className="min-h-[250px]">
              {chart.component}
            </div>
          )}
          
          {(isAnalysisExpanded || showAnalysisOnly) && chart.analysis && (
            <div className={`${!showAnalysisOnly ? 'mt-4' : ''} bg-orange-50 p-4 rounded-md text-sm text-gray-700`}>
              <p className="font-medium mb-1">Análise:</p>
              <p>{chart.analysis}</p>
            </div>
          )}
        </CardContent>
      </CardComponent>
    </div>
  );
};

export default ChartCard;
