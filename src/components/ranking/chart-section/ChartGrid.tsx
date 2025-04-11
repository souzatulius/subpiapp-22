
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ChartCard from './ChartCard';
import { ChartItem } from '../types';

interface ChartGridProps {
  chartItems: ChartItem[];
  hiddenCharts: string[];
  expandedAnalyses: string[];
  analysisOnlyCharts: string[];
  handleDragEnd: (result: any) => void;
  handleToggleVisibility: (chartId: string) => void;
  handleToggleAnalysis: (chartId: string) => void;
  handleToggleView: (chartId: string) => void;
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
  // Filter visible charts
  const visibleCharts = chartItems.filter(chart => !hiddenCharts.includes(chart.id));
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chart-grid" direction="horizontal">
        {(provided) => (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {visibleCharts.map((chart, index) => (
              <ChartCard 
                key={chart.id}
                chart={chart}
                index={index}
                isAnalysisExpanded={expandedAnalyses.includes(chart.id)}
                showAnalysisOnly={analysisOnlyCharts.includes(chart.id)}
                onToggleVisibility={() => handleToggleVisibility(chart.id)}
                onToggleAnalysis={() => handleToggleAnalysis(chart.id)}
                onToggleView={() => handleToggleView(chart.id)}
                disableContainer={disableCardContainers}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChartGrid;
