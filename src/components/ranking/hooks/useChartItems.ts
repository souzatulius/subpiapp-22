
import { useState } from 'react';
import { ChartItem } from '../../../types/ranking';

export const useChartItems = () => {
  const [items, setItems] = useState<ChartItem[]>([
    {
      id: 'status-distribution',
      title: 'Distribuição por Status',
      description: 'Visão geral dos serviços por status',
      component: <div>Status Distribution Chart</div>,
      isVisible: true,
      analysis: 'A maioria dos serviços está em andamento, seguido por pendentes e concluídos.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    },
    {
      id: 'top-companies',
      title: 'Empresas com mais Demandas',
      description: 'Ranking de empresas com maior número de solicitações',
      component: <div>Top Companies Chart</div>,
      isVisible: true,
      analysis: 'As empresas A, B e C são responsáveis por 65% de todas as demandas registradas.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    },
    {
      id: 'district-distribution',
      title: 'Demandas por Distrito',
      description: 'Distribuição geográfica das demandas por distrito',
      component: <div>District Distribution Chart</div>,
      isVisible: true,
      analysis: 'O distrito Central concentra 40% das demandas, seguido pelo Norte com 25%.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    },
    {
      id: 'services-department',
      title: 'Serviços por Departamento',
      description: 'Distribuição dos serviços entre departamentos',
      component: <div>Services By Department Chart</div>,
      isVisible: true,
      analysis: 'O departamento de Manutenção lidera com 35% dos serviços, seguido por Infraestrutura com 28%.',
      isAnalysisExpanded: false,
      showAnalysisOnly: false
    }
    // Just include a few items for now as examples
  ]);

  const toggleVisibility = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isVisible: !item.isVisible } : item
    ));
  };

  const toggleAnalysis = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isAnalysisExpanded: !item.isAnalysisExpanded } : item
    ));
  };

  const toggleView = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, showAnalysisOnly: !item.showAnalysisOnly } : item
    ));
  };

  const reorderItems = (reorderedItems: ChartItem[]) => {
    setItems(reorderedItems);
  };

  return { items, toggleVisibility, toggleAnalysis, toggleView, reorderItems };
};

export default useChartItems;
