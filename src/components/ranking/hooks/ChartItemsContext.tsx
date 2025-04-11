
import React from 'react';
import { useChartItemsState } from './useChartItemsState';
import { ChartItem } from '../../../types/ranking';

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
  handleDragEnd: (event: any) => void;
  handleToggleVisibility: (id: string) => void;
  handleToggleAnalysis: (id: string) => void;
  handleToggleView: (id: string) => void;
}

const ChartItemsContext = React.createContext<ChartItemsContextType | null>(null);

export const ChartItemsProvider: React.FC<{
  children: React.ReactNode;
  initialItems?: ChartItem[];
}> = ({ children, initialItems = [] }) => {
  const {
    items: chartItems,
    setItems: setChartItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  } = useChartItemsState(initialItems);

  // Add the missing properties required by the interface
  const [visibleChartIds, setVisibleChartIds] = React.useState<string[]>(
    chartItems.map(item => item.id)
  );
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const categories = ["all", "performance", "distribution", "efficiency"];
  const visibleChartItems = chartItems.filter(item => !hiddenCharts.includes(item.id));

  const contextValue: ChartItemsContextType = {
    chartItems,
    setChartItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    visibleChartIds,
    setVisibleChartIds,
    activeCategory,
    setActiveCategory,
    categories,
    visibleChartItems,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
  
  return (
    <ChartItemsContext.Provider value={contextValue}>
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
