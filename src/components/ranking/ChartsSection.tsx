import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useChartItemsState } from './hooks/useChartItemsState';
import { createChartItems } from './utils/chartItemsFactory';
import SortableChartCard from './chart-components/SortableChartCard';

// Import chart registration
import './charts/ChartRegistration';

interface ChartsSectionProps {
  chartData: any;
  isLoading: boolean;
  chartVisibility: ChartVisibility;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  chartData,
  isLoading,
  chartVisibility
}) => {
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  
  // Create chart items based on current state
  const initialChartItems = React.useMemo(() => createChartItems({
    chartData,
    isLoading,
    chartVisibility,
    hiddenCharts: [],
    expandedAnalyses: [],
    analysisOnlyCharts: []
  }), [chartData, isLoading, chartVisibility]);

  // Use the chart items state hook
  const {
    chartItems,
    hiddenCharts,
    expandedAnalyses,
    analysisOnlyCharts,
    handleDragEnd,
    handleToggleVisibility,
    handleToggleAnalysis,
    handleToggleView
  } = useChartItemsState(initialChartItems);
  
  // Update chart items when data or visibility changes
  React.useEffect(() => {
    const updatedItems = createChartItems({
      chartData,
      isLoading,
      chartVisibility,
      hiddenCharts,
      expandedAnalyses,
      analysisOnlyCharts
    });
    // The hook will update the state
  }, [chartData, isLoading, chartVisibility, hiddenCharts, expandedAnalyses, analysisOnlyCharts]);
  
  if (!chartData && !isLoading) {
    return <NoDataMessage />;
  }
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={chartItems.map(item => item.id)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartItems.map((item) => (
            <SortableChartCard
              key={item.id}
              id={item.id}
              component={item.component}
              isVisible={item.isVisible}
              isAnalysisExpanded={item.isAnalysisExpanded}
              showAnalysisOnly={item.showAnalysisOnly}
              title={item.title}
              analysis={item.analysis}
              onToggleVisibility={() => handleToggleVisibility(item.id)}
              onToggleAnalysis={() => handleToggleAnalysis(item.id)}
              onToggleView={() => handleToggleView(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ChartsSection;
