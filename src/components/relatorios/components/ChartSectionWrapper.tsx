
import React, { ReactNode } from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { RelatorioItem } from '../hooks/useRelatorioItemsState';

interface ChartSectionWrapperProps {
  title: string;
  items: RelatorioItem[];
  renderItem: (item: RelatorioItem) => ReactNode;
}

const ChartSectionWrapper: React.FC<ChartSectionWrapperProps> = ({
  title,
  items,
  renderItem
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <SortableContext items={items.map(item => item.id)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => renderItem(item))}
        </div>
      </SortableContext>
    </div>
  );
};

export default ChartSectionWrapper;
