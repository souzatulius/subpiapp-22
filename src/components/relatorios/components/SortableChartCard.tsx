
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, BarChart2, FileText, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';
import { cn } from '@/lib/utils';

interface SortableChartCardProps {
  item: RelatorioItem;
  onToggleVisibility: (itemId: string) => void;
  onToggleAnalysis: (itemId: string) => void;
  onToggleView: (itemId: string) => void;
}

export const SortableChartCard: React.FC<SortableChartCardProps> = ({
  item,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
}) => {
  const { id, title, component, isVisible, isAnalysisExpanded, showAnalysisOnly, analysis, badge, value, description } = item;

  if (!isVisible) return null;
  
  return (
    <Card className="relative">
      <div className="absolute top-3 right-3 flex space-x-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleVisibility(id)}
          className="h-8 w-8"
          title="Ocultar gráfico"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        
        {analysis && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleAnalysis(id)}
            className="h-8 w-8"
            title="Alternar análise"
          >
            {isAnalysisExpanded ? <BarChart2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </Button>
        )}

        {analysis && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleView(id)}
            className="h-8 w-8"
            title="Alternar visualização"
          >
            {showAnalysisOnly ? <BarChart2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      <div className="absolute top-3 left-3">
        <div className="cursor-grab">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <CardHeader className="pt-10 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {badge && (
            <Badge className={cn(
              "ml-2",
              badge.type === 'success' && "bg-green-500",
              badge.type === 'warning' && "bg-amber-500",
              badge.type === 'danger' && "bg-red-500"
            )}>
              {badge.text}
            </Badge>
          )}
        </div>
        
        {value && (
          <div className="text-2xl font-bold mt-1">{value}</div>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        {!showAnalysisOnly && component}
        
        {analysis && isAnalysisExpanded && (
          <div className={cn("bg-slate-50 p-4 rounded-md mt-4", showAnalysisOnly && "mt-0")}>
            <h4 className="font-semibold mb-2">Análise</h4>
            <p className="text-sm text-gray-700">{analysis}</p>
          </div>
        )}
      </CardContent>

      {/* Optional footer for future use */}
      {false && <CardFooter className="pt-0"></CardFooter>}
    </Card>
  );
};
