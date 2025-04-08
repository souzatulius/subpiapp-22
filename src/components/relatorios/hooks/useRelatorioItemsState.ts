
import React, { useState, useCallback, useMemo } from 'react';
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface RelatorioItem {
  id: string;
  title: string;
  subtitle?: string; // Add subtitle property
  component: React.ReactNode;
  isVisible: boolean;
  isHidden?: boolean;
  isAnalysisExpanded?: boolean;
  showAnalysisOnly?: boolean;
  analysis?: string;
  value?: string | number;
  description?: string;
  badge?: string;
  props?: Record<string, any>;
  highlight?: string;
  order?: number; // Add order property
}

export const useRelatorioItemsState = (initialItems: RelatorioItem[]) => {
  const [items, setItems] = useState<RelatorioItem[]>(initialItems);
  const [hiddenItems, setHiddenItems] = useLocalStorage<string[]>('relatorio-hidden-items', []);
  const [expandedAnalyses, setExpandedAnalyses] = useLocalStorage<string[]>('relatorio-expanded-analyses', []);
  const [analysisOnlyItems, setAnalysisOnlyItems] = useLocalStorage<string[]>('relatorio-analysis-only', []);

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

  const toggleItemVisibility = useCallback((itemId: string) => {
    setHiddenItems((prevHiddenItems) => {
      if (prevHiddenItems.includes(itemId)) {
        return prevHiddenItems.filter((id) => id !== itemId);
      } else {
        return [...prevHiddenItems, itemId];
      }
    });
  }, [setHiddenItems]);

  const toggleItemAnalysis = useCallback((itemId: string) => {
    setExpandedAnalyses((prevExpandedAnalyses) => {
      if (prevExpandedAnalyses.includes(itemId)) {
        return prevExpandedAnalyses.filter((id) => id !== itemId);
      } else {
        return [...prevExpandedAnalyses, itemId];
      }
    });
  }, [setExpandedAnalyses]);

  const toggleItemView = useCallback((itemId: string) => {
    setAnalysisOnlyItems((prevAnalysisOnlyItems) => {
      if (prevAnalysisOnlyItems.includes(itemId)) {
        return prevAnalysisOnlyItems.filter((id) => id !== itemId);
      } else {
        return [...prevAnalysisOnlyItems, itemId];
      }
    });
  }, [setAnalysisOnlyItems]);

  const updateItemsOrder = useCallback((reorderedItems: RelatorioItem[]) => {
    setItems(reorderedItems);
  }, []);

  // Aliases for RelatoriosContent component
  const handleToggleVisibility = toggleItemVisibility;
  const handleToggleAnalysis = toggleItemAnalysis;
  const handleToggleView = toggleItemView;

  return {
    items,
    hiddenItems,
    expandedAnalyses,
    analysisOnlyItems,
    toggleItemVisibility,
    toggleItemAnalysis,
    toggleItemView,
    updateItemsOrder,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
};
