
import React, { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface RelatorioItem {
  id: string;
  title: string;
  component: React.ReactNode;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  analysis?: string;
  description?: string;
  value?: string | number;
  badge?: {
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary";
    icon?: React.ReactNode;
  };
}

export const useRelatorioItemsState = (initialItems: RelatorioItem[]) => {
  const [items, setItems] = useState<RelatorioItem[]>(initialItems);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyItems, setAnalysisOnlyItems] = useState<string[]>([]);

  // Handle drag end event to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const activeIndex = currentItems.findIndex((item) => item.id === active.id);
        const overIndex = currentItems.findIndex((item) => item.id === over.id);
        
        return arrayMove(currentItems, activeIndex, overIndex);
      });
    }
  };

  // Toggle item visibility
  const handleToggleVisibility = (id: string) => {
    setHiddenItems((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      } else {
        return [...current, id];
      }
    });
    
    setItems((currentItems) => 
      currentItems.map(item => 
        item.id === id 
          ? { ...item, isVisible: !item.isVisible }
          : item
      )
    );
  };

  // Toggle analysis expansion
  const handleToggleAnalysis = (id: string) => {
    setExpandedAnalyses((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      } else {
        return [...current, id];
      }
    });
    
    setItems((currentItems) => 
      currentItems.map(item => 
        item.id === id 
          ? { ...item, isAnalysisExpanded: !item.isAnalysisExpanded }
          : item
      )
    );
  };

  // Toggle between chart and analysis view
  const handleToggleView = (id: string) => {
    setAnalysisOnlyItems((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      } else {
        return [...current, id];
      }
    });
    
    setItems((currentItems) => 
      currentItems.map(item => 
        item.id === id 
          ? { ...item, showAnalysisOnly: !item.showAnalysisOnly }
          : item
      )
    );
  };

  return {
    items,
    hiddenItems,
    expandedAnalyses,
    analysisOnlyItems,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView,
    setItems
  };
};
