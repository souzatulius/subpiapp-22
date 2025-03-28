
import { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';

export interface ChartItem {
  id: string;
  component: React.ReactNode;
  isVisible: boolean;
  title: string;
  analysis: string;
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
}

export const useChartItemsState = (initialItems: ChartItem[]) => {
  const [chartItems, setChartItems] = useState<ChartItem[]>(initialItems);
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = useState<string[]>([]);
  
  // Update chart items when initial items change
  useEffect(() => {
    setChartItems(initialItems);
  }, [initialItems]);
  
  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChartItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);
  
  // Handle chart visibility toggle
  const handleToggleVisibility = useCallback((id: string) => {
    setHiddenCharts(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  // Handle analysis expansion toggle
  const handleToggleAnalysis = useCallback((id: string) => {
    setExpandedAnalyses(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  // Handle toggle between chart and analysis text
  const handleToggleView = useCallback((id: string) => {
    setAnalysisOnlyCharts(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  return {
    chartItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView,
  };
};
