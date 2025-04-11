
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Draggable } from 'react-beautiful-dnd';
import { ChevronDown, ChevronUp, Eye, EyeOff, BarChart2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

const ChartCard: React.FC<ChartCardProps> = ({
  chart,
  index,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  disableContainer = false
}) => {
  const CardComponent = disableContainer ? React.Fragment : Card;
  const cardProps = disableContainer ? {} : { className: "overflow-hidden" };
  
  return (
    <Draggable draggableId={chart.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="h-full"
        >
          <CardComponent {...cardProps}>
            <CardHeader 
              {...provided.dragHandleProps} 
              className={`${disableContainer ? 'px-0 pt-0' : ''} cursor-grab`}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{chart.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onToggleView}
                    title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar análise"}
                  >
                    {showAnalysisOnly ? (
                      <BarChart2 className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {chart.analysis && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onToggleAnalysis}
                      title={isAnalysisExpanded ? "Esconder análise" : "Mostrar análise"}
                    >
                      {isAnalysisExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onToggleVisibility}
                    title="Esconder gráfico"
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
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
      )}
    </Draggable>
  );
};

export default ChartCard;
