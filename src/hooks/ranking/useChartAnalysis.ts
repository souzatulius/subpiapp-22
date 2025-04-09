
import { useState } from 'react';

export interface ChartAnalyses {
  [key: string]: string;
}

export const useChartAnalysis = (initialAnalyses: ChartAnalyses) => {
  // State for tracking which charts show analysis instead of visualization
  const [analysisVisibility, setAnalysisVisibility] = useState<Record<string, boolean>>({});
  
  // Toggle analysis visibility for a specific chart
  const toggleAnalysisVisibility = (chartId: string) => {
    setAnalysisVisibility(prevState => ({
      ...prevState,
      [chartId]: !prevState[chartId]
    }));
  };
  
  // Get analysis for a chart
  const getAnalysis = (chartId: string): string => {
    return initialAnalyses[chartId] || 'Análise não disponível para este gráfico.';
  };
  
  // Check if chart is showing analysis
  const isShowingAnalysis = (chartId: string): boolean => {
    return !!analysisVisibility[chartId];
  };
  
  return {
    analysisVisibility,
    toggleAnalysisVisibility,
    getAnalysis,
    isShowingAnalysis
  };
};
