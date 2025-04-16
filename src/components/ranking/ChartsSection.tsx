
import React from 'react';
import { ChartVisibility } from '@/components/ranking/types'; // Import from component types
import { ChartItem } from '@/components/ranking/types'; // Use the component types definition
import NoDataMessage from './charts/NoDataMessage';
import ChartSectionHeader from './chart-section/ChartSectionHeader';
import ChartGrid from './chart-section/ChartGrid';

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
  const hasData = Boolean(
    (sgzData && Array.isArray(sgzData) && sgzData.length > 0) || 
    (painelData && Array.isArray(painelData) && painelData.length > 0)
  );
  
  // Get chart items for the display
  const [chartItems, setChartItems] = React.useState<ChartItem[]>([]);
  const [hiddenCharts, setHiddenCharts] = React.useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = React.useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = React.useState<string[]>([]);
  
  // Load chart items based on data
  React.useEffect(() => {
    if (hasData || isLoading) {
      // This would typically populate from API or other data sources
      // For now, we'll just use empty items since the real implementation would come later
      setChartItems([]);
    }
  }, [hasData, isLoading, chartData, sgzData, painelData]);
  
  // Handle chart reordering
  const handleDragEnd = (result: any) => {
    // Implement drag end logic here
  };
  
  // Toggle chart visibility
  const handleToggleVisibility = (chartId: string) => {
    setHiddenCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };
  
  // Toggle analysis expansion
  const handleToggleAnalysis = (chartId: string) => {
    setExpandedAnalyses(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };
  
  // Toggle chart view mode
  const handleToggleView = (chartId: string) => {
    setAnalysisOnlyCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };
  
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
        chartItems={chartItems || []}
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
