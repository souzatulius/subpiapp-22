
import { useState } from 'react';

export interface ChartItem {
  id: string;
  title: string;
  description: string;
  type: string;
  isVisible: boolean;
  order: number;
}

export const useChartItems = () => {
  const [chartItems, setChartItems] = useState<ChartItem[]>([
    {
      id: '1',
      title: 'Demandas por Distrito',
      description: 'Visualização de demandas por distrito',
      type: 'bar',
      isVisible: true,
      order: 1
    },
    {
      id: '2',
      title: 'Evolução Temporal',
      description: 'Evolução das demandas ao longo do tempo',
      type: 'line',
      isVisible: true,
      order: 2
    },
    {
      id: '3',
      title: 'Serviços Mais Frequentes',
      description: 'Top serviços com mais ocorrências',
      type: 'pie',
      isVisible: true,
      order: 3
    }
  ]);

  const toggleChartVisibility = (id: string) => {
    setChartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const reorderCharts = (items: ChartItem[]) => {
    setChartItems(items);
  };

  return {
    chartItems,
    toggleChartVisibility,
    reorderCharts
  };
};
