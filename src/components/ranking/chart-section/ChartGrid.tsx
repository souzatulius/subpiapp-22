
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ChartItem } from '../hooks/useChartItemsState';
import SortableChartCard from '../chart-components/SortableChartCard';

interface ChartGridProps {
  chartItems: ChartItem[];
  hiddenCharts: string[];
  expandedAnalyses: string[];
  analysisOnlyCharts: string[];
  handleDragEnd: (event: any) => void;
  handleToggleVisibility: (id: string) => void;
  handleToggleAnalysis: (id: string) => void;
  handleToggleView: (id: string) => void;
  disableCardContainers?: boolean;
}

const ChartGrid: React.FC<ChartGridProps> = ({
  chartItems,
  hiddenCharts,
  expandedAnalyses,
  analysisOnlyCharts,
  handleDragEnd,
  handleToggleVisibility,
  handleToggleAnalysis,
  handleToggleView,
  disableCardContainers = false
}) => {
  // Set up DnD sensors with proper configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      // Add a custom coordinateGetter to prevent keyboard handling when focus is on input/textarea
      coordinateGetter: (event, args) => {
        const target = event.target as HTMLElement;
        const isInputElement = target.tagName.toLowerCase() === 'input' || 
                              target.tagName.toLowerCase() === 'textarea' ||
                              target.isContentEditable;

        if (isInputElement) {
          // Return null to prevent DnD operation when focus is on input elements
          return null;
        }
        
        // Use the default coordinate getter for other elements
        return args.context.activeNode ? args.context.activeNode.getBoundingClientRect() : null;
      }
    })
  );
  
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={chartItems.map(item => item.id)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {chartItems.map((item) => (
            <SortableChartCard
              key={item.id}
              id={item.id}
              component={item.component}
              isVisible={!hiddenCharts.includes(item.id)}
              isAnalysisExpanded={expandedAnalyses.includes(item.id)}
              showAnalysisOnly={analysisOnlyCharts.includes(item.id)}
              title={disableCardContainers ? "" : item.title} // Don't show title if containers are disabled
              analysis={item.analysis}
              onToggleVisibility={() => handleToggleVisibility(item.id)}
              onToggleAnalysis={() => handleToggleAnalysis(item.id)}
              onToggleView={() => handleToggleView(item.id)}
              disableCardContainer={disableCardContainers} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ChartGrid;
