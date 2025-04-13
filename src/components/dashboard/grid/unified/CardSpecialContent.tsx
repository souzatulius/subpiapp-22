import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import DynamicContentCard from '../../cards/DynamicContentCard';
import StatisticsCard from '../../cards/StatisticsCard';
interface GetSpecialContentProps {
  card: ActionCardItem;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  specialCardsData?: any;
}

// Default mock data for statistics to ensure consistent rendering
const DEFAULT_MOCK_STATISTICS = {
  demands: [{
    name: 'Pendentes',
    value: 25,
    color: '#3B82F6'
  }, {
    name: 'Em andamento',
    value: 15,
    color: '#F59E0B'
  }, {
    name: 'Concluídas',
    value: 45,
    color: '#10B981'
  }],
  notes: [{
    name: 'Aprovadas',
    value: 30,
    color: '#10B981'
  }, {
    name: 'Pendentes',
    value: 12,
    color: '#F59E0B'
  }, {
    name: 'Rejeitadas',
    value: 8,
    color: '#EF4444'
  }],
  news: [{
    name: 'Publicadas',
    value: 22,
    color: '#3B82F6'
  }, {
    name: 'Rascunhos',
    value: 10,
    color: '#9CA3AF'
  }]
};
const getSpecialContent = ({
  card,
  renderSpecialCardContent,
  specialCardsData = {} // Provide default empty object
}: GetSpecialContentProps): React.ReactNode | null => {
  // First check if there's a custom render function provided
  if (renderSpecialCardContent) {
    const customContent = renderSpecialCardContent(card.id);
    if (customContent) return customContent;
  }

  // Safely access data with defaults
  const safeSpecialCardsData = specialCardsData || {};
  const notasItems = safeSpecialCardsData.notasItems || [];
  const demandasItems = safeSpecialCardsData.demandasItems || [];
  const isLoading = safeSpecialCardsData.isLoading || false;

  // For cards with dataSourceKey
  if (card.dataSourceKey) {
    switch (card.dataSourceKey) {
      case 'ultimas_notas':
        return <DynamicContentCard items={notasItems} type="notes" isLoading={isLoading} />;
      case 'ultimas_demandas':
        return <DynamicContentCard items={demandasItems} type="demands" isLoading={isLoading} />;
      case 'estatisticas_gerais':
        if (isLoading) {
          return <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>;
        }

        // Use mock or provided statistics data
        const mockStatistics = safeSpecialCardsData.statistics || DEFAULT_MOCK_STATISTICS;

        // Create a dynamic charts view based on available statistics
        return <div className="grid grid-cols-3 gap-4 p-4 h-full">
            <StatisticsCard data={mockStatistics.demands} title="Demandas por Status" chartType="pie" />
            <StatisticsCard data={mockStatistics.notes} title="Notas por Status" chartType="bar" />
            <StatisticsCard data={mockStatistics.news} title="Notícias" chartType="pie" />
          </div>;
      default:
        return null;
    }
  }

  // Special handling for card types
  if (card.type) {
    switch (card.type) {
      case 'smart_search':
        return <div className="p-4 flex items-center justify-center h-full px-0 py-0 rounded-3xl border-orange-600">
            <input type="text" placeholder="Pesquisar..." onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = '/search';
          }} className="w-full p-2 border border-orange-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-[36px] text-2xl rounded-2xl bg-gray-25 py-[15px] my-[24px]" />
          </div>;

      // Add other card types as needed
      default:
        return null;
    }
  }
  return null;
};
export default getSpecialContent;