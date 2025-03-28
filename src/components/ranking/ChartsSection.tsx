
import React from 'react';
import { ChartVisibility } from './types';
import NoDataMessage from './charts/NoDataMessage';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useChartItemsState, ChartItem } from './hooks/useChartItemsState';
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
  
  // State for chart items
  const [chartItems, setChartItems] = React.useState<ChartItem[]>([]);
  const [hiddenCharts, setHiddenCharts] = React.useState<string[]>([]);
  const [expandedAnalyses, setExpandedAnalyses] = React.useState<string[]>([]);
  const [analysisOnlyCharts, setAnalysisOnlyCharts] = React.useState<string[]>([]);
  
  // Handle drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setChartItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
  };
  
  // Handle chart visibility toggle
  const handleToggleVisibility = (id: string) => {
    setHiddenCharts(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle analysis expansion toggle
  const handleToggleAnalysis = (id: string) => {
    setExpandedAnalyses(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle toggle between chart and analysis text
  const handleToggleView = (id: string) => {
    setAnalysisOnlyCharts(prev => {
      if (prev.includes(id)) {
        return prev.filter(chartId => chartId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Generate sample chart items for demo
  React.useEffect(() => {
    setChartItems([
      {
        id: 'chart1',
        title: 'Sample Chart 1',
        component: <div>Chart Component 1</div>,
        isVisible: true,
        analysis: 'Sample analysis text for chart 1',
        isAnalysisExpanded: false,
        showAnalysisOnly: false
      },
      {
        id: 'chart2',
        title: 'Sample Chart 2',
        component: <div>Chart Component 2</div>,
        isVisible: true,
        analysis: 'Sample analysis text for chart 2',
        isAnalysisExpanded: false,
        showAnalysisOnly: false
      }
    ]);
  }, [chartData]);
  
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
              isVisible={!hiddenCharts.includes(item.id)}
              isAnalysisExpanded={expandedAnalyses.includes(item.id)}
              showAnalysisOnly={analysisOnlyCharts.includes(item.id)}
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
