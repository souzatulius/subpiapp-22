
import { useState, useCallback } from 'react';

export interface RelatorioItem {
  id: string;
  title: string;
  subtitle?: string;
  component: React.ReactNode;
  isVisible: boolean;
  isAnalysisExpanded: boolean;
  showAnalysisOnly: boolean;
  analysis?: string;
  value?: string;
  description?: string;
  badge?: string;
  order: number;
  highlight?: string;  // Adicionado conforme usado em relatorioItemsFactory
  props?: any;  // Support props passed to components
}

export const useRelatorioItemsState = (initialItems: RelatorioItem[] = []) => {
  const [items, setItems] = useState<RelatorioItem[]>(initialItems);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  const [analysisOnlyItems, setAnalysisOnlyItems] = useState<string[]>([]);

  const toggleItemVisibility = useCallback((id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, isVisible: !item.isVisible } 
          : item
      )
    );
    
    setHiddenItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const toggleAnalysisExpanded = useCallback((id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, isAnalysisExpanded: !item.isAnalysisExpanded } 
          : item
      )
    );
    
    setExpandedAnalyses(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const toggleAnalysisOnly = useCallback((id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, showAnalysisOnly: !item.showAnalysisOnly } 
          : item
      )
    );
    
    setAnalysisOnlyItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  
  // Adding these to match usage in RelatoriosContent.tsx
  const handleDragEnd = useCallback(() => {
    // Implementation would go here for drag and drop functionality
  }, []);
  
  const handleToggleVisibility = useCallback((id: string) => {
    toggleItemVisibility(id);
  }, [toggleItemVisibility]);
  
  const handleToggleAnalysis = useCallback((id: string) => {
    toggleAnalysisExpanded(id);
  }, [toggleAnalysisExpanded]);
  
  const handleToggleView = useCallback((id: string) => {
    toggleAnalysisOnly(id);
  }, [toggleAnalysisOnly]);

  return {
    items,
    setItems,
    hiddenItems,
    expandedAnalyses,
    analysisOnlyItems,
    toggleItemVisibility,
    toggleAnalysisExpanded,
    toggleAnalysisOnly,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis, 
    handleToggleView
  };
};
