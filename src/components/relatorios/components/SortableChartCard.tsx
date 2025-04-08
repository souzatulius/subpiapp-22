
import React from 'react';
import ChartItem from './ChartItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';

interface SortableChartCardProps {
  item: RelatorioItem;
  onToggleVisibility: (itemId: string) => void;
  onToggleAnalysis: (itemId: string) => void;
  onToggleView: (itemId: string) => void;
}

export const SortableChartCard: React.FC<SortableChartCardProps> = ({
  item,
  onToggleVisibility,
  onToggleAnalysis,
  onToggleView
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: '100%'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ChartItem
        id={item.id}
        title={item.title}
        value={item.value}
        description={item.description}
        component={item.component}
        isVisible={item.isVisible}
        analysis={item.analysis}
        isAnalysisExpanded={item.isAnalysisExpanded}
        showAnalysisOnly={item.showAnalysisOnly}
        onToggleVisibility={() => onToggleVisibility(item.id)}
        onToggleAnalysis={() => onToggleAnalysis(item.id)}
        onToggleView={() => onToggleView(item.id)}
      />
    </div>
  );
};
