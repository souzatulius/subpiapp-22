
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import DynamicContentCard from '../../cards/DynamicContentCard';
import StatisticsCard from '../../cards/StatisticsCard';
import OriginDemandStatistics from '../../cards/OriginDemandStatistics';
import PendingActionsCard from '../../cards/PendingActionsCard';
import { Search } from 'lucide-react';

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
    color: '#3B82F6',
    change: '+5%' // Added change data for KPI comparison
  }, {
    name: 'Em andamento',
    value: 15,
    color: '#F59E0B',
    change: '-2%'
  }, {
    name: 'Concluídas',
    value: 45,
    color: '#10B981',
    change: '+12%'
  }],
  notes: [{
    name: 'Aprovadas',
    value: 30,
    color: '#10B981',
    change: '+8%'
  }, {
    name: 'Pendentes',
    value: 12,
    color: '#F59E0B',
    change: '-3%'
  }, {
    name: 'Rejeitadas',
    value: 8,
    color: '#EF4444',
    change: '+1%'
  }],
  news: [{
    name: 'Publicadas',
    value: 22,
    color: '#3B82F6',
    change: '+5%'
  }, {
    name: 'Rascunhos',
    value: 10,
    color: '#9CA3AF',
    change: '0%'
  }],
  esic: [{
    name: 'Abertos',
    value: 18,
    color: '#F59E0B',
    change: '+2%'
  }, {
    name: 'Finalizados',
    value: 42,
    color: '#10B981',
    change: '+15%'
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

  // Check for specific card IDs
  if (card.id === 'origem-demandas') {
    return <OriginDemandStatistics showComparison={true} />;
  }

  if (card.id === 'acoes-pendentes') {
    return <PendingActionsCard showDetailedList={true} />;
  }

  if (card.id === 'atividades-andamento') {
    return (
      <div className="p-4 h-full">
        <h3 className="font-medium mb-2">Atividades em Andamento</h3>
        <ul className="space-y-2">
          {specialCardsData?.activities ? (
            specialCardsData.activities.map((activity, index) => (
              <li key={index} className={`p-2 ${index % 3 === 0 ? 'bg-blue-50' : index % 3 === 1 ? 'bg-orange-50' : 'bg-green-50'} rounded-lg text-sm`}>
                {activity.title || activity}
              </li>
            ))
          ) : (
            <>
              <li className="p-2 bg-blue-50 rounded-lg text-sm">Análise de demanda de imprensa</li>
              <li className="p-2 bg-orange-50 rounded-lg text-sm">Preparação de nota oficial</li>
              <li className="p-2 bg-green-50 rounded-lg text-sm">Notificação de equipe</li>
            </>
          )}
        </ul>
      </div>
    );
  }

  if (card.id === 'busca-rapida') {
    return <div className="p-4 flex items-center justify-center w-full h-full">
        <div className="bg-white rounded-lg w-full flex items-center shadow-sm border border-gray-200">
          <Search className="h-5 w-5 ml-3 text-gray-500" />
          <input type="text" placeholder="Pesquisar..." className="w-full p-2 border-none focus:outline-none focus:ring-0 rounded-lg" onClick={e => {
          e.preventDefault();
        }} />
        </div>
      </div>;
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
            <StatisticsCard data={mockStatistics.demands} title="Demandas por Status" chartType="pie" showChange={true} />
            <StatisticsCard data={mockStatistics.notes} title="Notas por Status" chartType="bar" showChange={true} />
            <StatisticsCard data={mockStatistics.news} title="Notícias" chartType="pie" showChange={true} />
            {mockStatistics.esic && <StatisticsCard data={mockStatistics.esic} title="Processos e-SIC" chartType="pie" showChange={true} />}
          </div>;
      default:
        return null;
    }
  }

  // Special handling for card types
  if (card.type) {
    switch (card.type) {
      case 'smart_search':
        return <div className="p-4 flex items-center justify-center h-full py-0 rounded-3xl border-orange-600 mx-0 px-0">
            <div className="bg-white rounded-lg w-full flex items-center shadow-sm border border-gray-200">
              <Search className="h-8 w-8 ml-3 text-gray-500 mx-[17px]" />
              <input type="text" placeholder="Pesquisar..." onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }} className="w-full p-2 border-none focus:outline-none focus:ring-0 rounded-lg text-2xl py-[17px]" />
            </div>
          </div>;

      // Add other card types as needed
      default:
        return null;
    }
  }
  return null;
};

export default getSpecialContent;
