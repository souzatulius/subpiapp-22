
import React from 'react';
import { EyeOff, BarChart2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChartControlsProps {
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  hasAnalysis: boolean;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  isAnalysisExpanded,
  showAnalysisOnly,
  hasAnalysis
}) => {
  return (
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
              onClick={onToggleVisibility}
            >
              <EyeOff className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ocultar card</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {hasAnalysis && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
                  onClick={onToggleAnalysis}
                >
                  <BookOpen className="h-3.5 w-3.5 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expandir/recolher análise</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
                  onClick={onToggleView}
                >
                  {showAnalysisOnly ? (
                    <BarChart2 className="h-3.5 w-3.5 text-gray-600" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 text-gray-600" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showAnalysisOnly ? 'Mostrar gráfico' : 'Mostrar apenas análise'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};
