
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import { useChartItemsState } from './hooks/useChartItemsState';
import { useChartItems } from './hooks/useChartItems';
import ChartSectionHeader from './chart-section/ChartSectionHeader';
import ChartGrid from './chart-section/ChartGrid';

// Import chart registration
import './charts/ChartRegistration';

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
  sgzData: any[] | null;
  painelData: any[] | null;
  onSimulateIdealRanking: () => void;
  isSimulationActive: boolean;
  disableCardContainers?: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility,
  sgzData,
  painelData,
  onSimulateIdealRanking,
  isSimulationActive,
  disableCardContainers = false
}) => {
  // Check if we have data to display
  const hasData = Boolean((sgzData && sgzData.length > 0) || (painelData && painelData.length > 0));
  
  // Get chart items from hook
  const { chartItems } = useChartItems({
    chartData,
    isLoading,
    sgzData,
    painelData,
    isSimulationActive,
    hasData
  });
  
  // Get chart item state management from hook
  const {
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  } = useChartItemsState(chartItems);
  
  if (!hasData && !isLoading) {
    return <NoDataMessage />;
  }
  
  return (
    <>
      <ChartSectionHeader 
        onSimulateIdealRanking={onSimulateIdealRanking}
        isSimulationActive={isSimulationActive}
      />
      
      <ChartGrid
        chartItems={chartItems}
        hiddenCharts={hiddenCharts}
        expandedAnalyses={expandedAnalyses}
        analysisOnlyCharts={analysisOnlyCharts}
        handleDragEnd={handleDragEnd}
        handleToggleVisibility={handleToggleVisibility}
        handleToggleAnalysis={handleToggleAnalysis}
        handleToggleView={handleToggleView}
        disableCardContainers={disableCardContainers}
      />
    </>
  );
};

export default ChartsSection;
