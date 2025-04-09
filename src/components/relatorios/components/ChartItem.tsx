
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp, BarChart4, FileText } from 'lucide-react';

interface ChartItemProps {
  id: string;
  title: string;
  value?: string | number;
  description?: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis?: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
}

const ChartItem: React.FC<ChartItemProps> = ({
  title,
  value,
  description,
  component,
  isVisible,
  analysis,
  isAnalysisExpanded,
  showAnalysisOnly,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
}) => {
  if (!isVisible) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
          <p className="text-gray-400 mb-2">Este gráfico está oculto</p>
          <Button variant="outline" size="sm" onClick={onToggleVisibility}>
            <Eye className="mr-2 h-4 w-4" />
            Mostrar gráfico
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full relative group">
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-medium">{title}</h3>
          {value && <p className="text-2xl font-bold mt-1">{value}</p>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={onToggleVisibility}
            title="Ocultar gráfico"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>

        {!showAnalysisOnly && (
          <div className="mb-2">{component}</div>
        )}

        {analysis && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">
                <FileText className="inline mr-1 h-4 w-4" /> Análise
              </h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onToggleView}
                  title={showAnalysisOnly ? "Mostrar gráfico" : "Mostrar apenas análise"}
                >
                  {showAnalysisOnly ? <BarChart4 className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onToggleAnalysis}
                  title={isAnalysisExpanded ? "Reduzir análise" : "Expandir análise"}
                >
                  {isAnalysisExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className={isAnalysisExpanded ? "" : "line-clamp-3"}>
              <p className="text-sm text-gray-600">{analysis}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartItem;
