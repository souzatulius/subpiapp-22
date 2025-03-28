
import React from 'react';
import ChartSectionWrapper from '../components/ChartSectionWrapper';
import ChartItem from '../components/ChartItem';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';

interface TempoDesempenhoProps {
  items: RelatorioItem[];
  isLoading: boolean;
  handleToggleVisibility: (id: string) => void;
  handleToggleAnalysis: (id: string) => void;
  handleToggleView: (id: string) => void;
}

const TempoDesempenho: React.FC<TempoDesempenhoProps> = ({
  items,
  isLoading,
  handleToggleVisibility,
  handleToggleAnalysis,
  handleToggleView
}) => {
  const renderChartItem = (item: RelatorioItem) => (
    <ChartItem
      key={item.id}
      id={item.id}
      title={item.title}
      value={item.value}
      analysis={item.analysis}
      isVisible={item.isVisible}
      isAnalysisExpanded={item.isAnalysisExpanded}
      showAnalysisOnly={item.showAnalysisOnly}
      isLoading={isLoading}
      onToggleVisibility={() => handleToggleVisibility(item.id)}
      onToggleAnalysis={() => handleToggleAnalysis(item.id)}
      onToggleView={() => handleToggleView(item.id)}
      component={item.component}
    />
  );

  return (
    <ChartSectionWrapper
      title="Tempo e Desempenho"
      items={items}
      renderItem={renderChartItem}
    />
  );
};

export default TempoDesempenho;
