
import { useState, useCallback } from 'react';
import { ChartItem } from '../types';

export const useChartItemsState = (chartItems: ChartItem[]) => {
  // State for tracking hidden charts
  const [hiddenCharts, setHiddenCharts] = useState<string[]>([]);
  
  // State for tracking expanded analyses
  const [expandedAnalyses, setExpandedAnalyses] = useState<string[]>([]);
  
  // State for tracking charts shown in analysis-only mode
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = useState<string[]>([]);
  
  // Handle drag end to reorder charts
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    // Here you would implement logic to reorder the chart items
    console.log('Chart reordered:', result);
  }, []);
  
  // Toggle chart visibility
  const handleToggleVisibility = useCallback((chartId: string) => {
    setHiddenCharts(prev => [...prev, chartId]);
  }, []);
  
  // Toggle chart analysis expanded state
  const handleToggleAnalysis = useCallback((chartId: string) => {
    setExpandedAnalyses(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  }, []);
  
  // Toggle between chart view and analysis-only view
  const handleToggleView = useCallback((chartId: string) => {
    setAnalysisOnlyCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  }, []);
  
  return {
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  };
};
