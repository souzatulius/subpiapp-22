
import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface ChartItem {
  id: string;
  title: string;
  component: React.ReactNode;
  isVisible: boolean;
  analysis: string;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
}

export const useChartItemsState = (initialItems: ChartItem[]) => {
  const [items, setItems] = useState<ChartItem[]>(initialItems);
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = useState<string[]>([]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleToggleVisibility = useCallback((id: string) => {
    setHiddenCharts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((chartId) => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleToggleAnalysis = useCallback((id: string) => {
    setExpandedAnalyses((prev) => {
      if (prev.includes(id)) {
        return prev.filter((chartId) => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  const handleToggleView = useCallback((id: string) => {
    setAnalysisOnlyCharts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((chartId) => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
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
