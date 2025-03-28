
import React from 'react';
import SortableRelatorioCard from './SortableRelatorioCard';

interface ChartItemProps {
  id: string;
  title: string;
  value?: string | number;
  analysis?: string;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  isLoading: boolean;
  onToggleVisibility: () => void;
  onToggleAnalysis: () => void;
  onToggleView: () => void;
  component: React.ReactNode;
}

const ChartItem: React.FC<ChartItemProps> = ({
  id,
  title,
  value,
  analysis,
  isVisible,
  isAnalysisExpanded,
  showAnalysisOnly,
  isLoading,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView,
  component
}) => {
  return (
    <SortableRelatorioCard
      key={id}
      id={id}
      title={title}
      value={value}
      analysis={analysis}
      isVisible={isVisible}
      isAnalysisExpanded={isAnalysisExpanded}
      showAnalysisOnly={showAnalysisOnly}
      isLoading={isLoading}
      onToggleVisibility={onToggleVisibility}
      onToggleAnalysis={onToggleAnalysis}
      onToggleView={onToggleView}
    >
      {component}
    </SortableRelatorioCard>
  );
};

export default ChartItem;
