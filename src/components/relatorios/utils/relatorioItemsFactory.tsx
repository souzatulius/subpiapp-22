
import React from 'react';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';

interface CreateRelatorioItemsParams {
  chartData: Record<string, any>;
  chartComponents: Record<string, React.ReactNode>;
  isLoading: boolean;
  hiddenItems: string[];
  expandedAnalyses: string[];
  analysisOnlyItems: string[];
}

export const createRelatorioItems = ({
  chartData,
  chartComponents,
  isLoading,
  hiddenItems,
  expandedAnalyses,
  analysisOnlyItems
}: CreateRelatorioItemsParams): RelatorioItem[] => {
  // Criar itens baseados nos componentes fornecidos
  return Object.keys(chartComponents).map(key => {
    return {
      id: key,
      title: chartData?.[key]?.title || key,
      component: chartComponents[key],
      isVisible: !hiddenItems.includes(key),
      isAnalysisExpanded: expandedAnalyses.includes(key),
      showAnalysisOnly: analysisOnlyItems.includes(key),
      analysis: chartData?.[key]?.analysis || undefined,
      value: chartData?.[key]?.value || '',
      description: chartData?.[key]?.description || undefined,
      badge: chartData?.[key]?.badge || undefined
    };
  });
};
