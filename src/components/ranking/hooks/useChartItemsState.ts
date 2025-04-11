
import { useState, useCallback } from 'react';
import { ChartItem } from '../../../types/ranking';

// Helper function to generate fake analysis text
export const generateFakeAnalysis = (title: string): string => {
  return `Análise de ${title}: Os dados indicam uma tendência de melhoria na performance geral, com destaque para redução de tempo médio de resolução.`;
};

export const useChartItemsState = (initialItems: ChartItem[] = []) => {
  const [items, setItems] = useState<ChartItem[]>(initialItems);
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = useState<string[]>([]);

  // Handle chart reordering after drag and drop
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    
    setItems(reorderedItems);
  }, [items]);

  // Toggle chart visibility
  const handleToggleVisibility = useCallback((chartId: string) => {
    setHiddenCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  }, []);

  // Toggle analysis expansion
  const handleToggleAnalysis = useCallback((chartId: string) => {
    setExpandedAnalyses(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  }, []);

  // Toggle chart view mode (chart or analysis only)
  const handleToggleView = useCallback((chartId: string) => {
    setAnalysisOnlyCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  }, []);

  return {
    items,
    setItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
};
