
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface RelatorioItem {
  id: string;
  title: string;
  subtitle?: string; // Add subtitle property
  component: React.ReactNode;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  analysis?: string;
  value?: string;
  description?: string;
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'danger' | 'info';
  };
  order?: number; // Add order property
}

// Hook to manage relatorio items state
export const useRelatorioItemsState = (defaultItems: RelatorioItem[], sectionId: string) => {
  // Local storage key for hidden items and expanded analyses
  const hiddenKey = `relatorio-hidden-${sectionId}`;
  const expandedKey = `relatorio-expanded-${sectionId}`;
  const analysisOnlyKey = `relatorio-analysis-only-${sectionId}`;
  const orderKey = `relatorio-order-${sectionId}`;
  
  // Load state from local storage
  const [hiddenItems, setHiddenItems] = useLocalStorage<string[]>(hiddenKey, []);
  const [expandedAnalyses, setExpandedAnalyses] = useLocalStorage<string[]>(expandedKey, []);
  const [analysisOnlyItems, setAnalysisOnlyItems] = useLocalStorage<string[]>(analysisOnlyKey, []);
  const [itemsOrder, setItemsOrder] = useLocalStorage<Record<string, number>>(orderKey, {});
  
  // Compute items with all state applied
  const [items, setItems] = useState<RelatorioItem[]>([]);
  
  // Apply stored states to items
  useEffect(() => {
    const processedItems = defaultItems.map(item => ({
      ...item,
      isVisible: !hiddenItems.includes(item.id),
      isAnalysisExpanded: expandedAnalyses.includes(item.id),
      showAnalysisOnly: analysisOnlyItems.includes(item.id),
      order: itemsOrder[item.id] || 0,
    }));
    
    // Sort by order if available
    const sortedItems = [...processedItems].sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    });
    
    setItems(sortedItems);
  }, [defaultItems, hiddenItems, expandedAnalyses, analysisOnlyItems, itemsOrder]);
  
  // Toggle visibility of an item
  const toggleItemVisibility = (itemId: string) => {
    setHiddenItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Toggle analysis expansion
  const toggleItemAnalysis = (itemId: string) => {
    setExpandedAnalyses(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Toggle between chart view and analysis-only view
  const toggleItemView = (itemId: string) => {
    setAnalysisOnlyItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Update item order
  const updateItemsOrder = (reorderedItems: RelatorioItem[]) => {
    const newOrder: Record<string, number> = {};
    reorderedItems.forEach((item, index) => {
      newOrder[item.id] = index;
    });
    setItemsOrder(newOrder);
  };
  
  return {
    items,
    toggleItemVisibility,
    toggleItemAnalysis,
    toggleItemView,
    updateItemsOrder,
    hiddenItems,
    expandedAnalyses,
    analysisOnlyItems
  };
};
