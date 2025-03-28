
import React from 'react';
import ChartSectionWrapper from '../components/ChartSectionWrapper';
import ChartItem from '../components/ChartItem';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';

interface TemasTecnicosProps {
  items: RelatorioItem[];
  isLoading: boolean;
  handleToggleVisibility: (id: string) => void;
  handleToggleAnalysis: (id: string) => void;
  handleToggleView: (id: string) => void;
}

const TemasTecnicos: React.FC<TemasTecnicosProps> = ({
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
      title="Temas Técnicos"
      items={items}
      renderItem={renderChartItem}
    />
  );
};

export default TemasTecnicos;
