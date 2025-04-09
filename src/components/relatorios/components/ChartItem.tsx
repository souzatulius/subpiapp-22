
import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ChartAnalysis } from './ChartAnalysis';
import { ChartControls } from './ChartControls';
import { Skeleton } from '@/components/ui/skeleton';

export interface ChartItemProps {
  id: string;
  title: string;
  value?: string;
  description?: string;
  analysis?: string;
  isVisible: boolean;
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
  isLoading?: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  component?: ReactNode;
}

const ChartItem: React.FC<ChartItemProps> = ({
  id,
  title,
  value,
  description,
  analysis,
  isVisible,
  isLoading = false,
  isAnalysisExpanded = false,
  showAnalysisOnly = false,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  component
}) => {
  if (!isVisible) return null;
  
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChartControls 
          onToggleVisibility={onToggleVisibility}
          onToggleAnalysis={onToggleAnalysis}
          onToggleView={onToggleView}
          isAnalysisExpanded={isAnalysisExpanded}
          showAnalysisOnly={showAnalysisOnly}
          hasAnalysis={!!analysis}
        />
      </div>

      <div className="p-4 pb-2">
        <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
        
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-20 mb-1 bg-gray-100" />
            {description && <Skeleton className="h-3 w-full bg-gray-50" />}
          </>
        ) : (
          <>
            {value && <p className="text-2xl font-bold text-blue-600">{value}</p>}
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </>
        )}
      </div>

      {showAnalysisOnly && analysis ? (
        <ChartAnalysis analysis={analysis} isExpanded={true} />
      ) : (
        <div className="p-2">
          {component}
        </div>
      )}
      
      {!showAnalysisOnly && analysis && (
        <ChartAnalysis analysis={analysis} isExpanded={isAnalysisExpanded} />
      )}
    </Card>
  );
};

export default ChartItem;
