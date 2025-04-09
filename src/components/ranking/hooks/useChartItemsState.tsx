
import React, { useState } from 'react';
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
  
  // Handle drag end event for chart reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    setItems((items) => {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
  };
  
  // Toggle chart visibility
  const handleToggleVisibility = (id: string) => {
    setHiddenCharts(prevHidden => {
      if (prevHidden.includes(id)) {
        return prevHidden.filter(itemId => itemId !== id);
      } else {
        return [...prevHidden, id];
      }
    });
  };
  
  // Toggle analysis expanded state
  const handleToggleAnalysis = (id: string) => {
    setExpandedAnalyses(prevExpanded => {
      if (prevExpanded.includes(id)) {
        return prevExpanded.filter(itemId => itemId !== id);
      } else {
        return [...prevExpanded, id];
      }
    });
  };
  
  // Toggle between chart and analysis view
  const handleToggleView = (id: string) => {
    setAnalysisOnlyCharts(prevAnalysisOnly => {
      if (prevAnalysisOnly.includes(id)) {
        return prevAnalysisOnly.filter(itemId => itemId !== id);
      } else {
        return [...prevAnalysisOnly, id];
      }
    });
  };
  
  return {
    items, 
    setItems,
    hiddenCharts,
    setHiddenCharts,
    expandedAnalyses,
    setExpandedAnalyses,
    analysisOnlyCharts,
    setAnalysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
};
