
import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { useChartItemsState, ChartItem } from './useChartItemsState';

interface ChartItemsContextType {
  chartItems: ChartItem[];
  setChartItems: React.Dispatch<React.SetStateAction<ChartItem[]>>;
  hiddenCharts: string[];
  expandedAnalyses: string[];
  analysisOnlyCharts: string[];
  visibleChartIds: string[];
  setVisibleChartIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  visibleChartItems: ChartItem[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleToggleVisibility: (id: string) => void;
  handleToggleAnalysis: (id: string) => void;
  handleToggleView: (id: string) => void;
}

const ChartItemsContext = React.createContext<ChartItemsContextType | null>(null);

export const ChartItemsProvider: React.FC<{
  children: React.ReactNode;
  initialItems?: ChartItem[];
}> = ({ children, initialItems = [] }) => {
  const chartItemsState = useChartItemsState(initialItems);
  return (
    <ChartItemsContext.Provider value={chartItemsState}>
      {children}
    </ChartItemsContext.Provider>
  );
};

export const useChartItemsContext = () => {
  const context = React.useContext(ChartItemsContext);
  if (!context) {
    throw new Error('useChartItemsContext must be used within a ChartItemsProvider');
  }
  return context;
};
