
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import DynamicContentCard from '../../cards/DynamicContentCard';
import StatisticsCard from '../../cards/StatisticsCard';

interface GetSpecialContentProps {
  card: ActionCardItem;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  specialCardsData?: any;
}

const getSpecialContent = ({ 
  card, 
  renderSpecialCardContent, 
  specialCardsData 
}: GetSpecialContentProps): React.ReactNode | null => {
  
  // First check if there's a custom render function provided
  if (renderSpecialCardContent) {
    const customContent = renderSpecialCardContent(card.id);
    if (customContent) return customContent;
  }

  // For cards with dataSourceKey
  if (card.dataSourceKey) {
    // Static mock data since we're not using hooks in this utility function
    const notasItems = specialCardsData?.notasItems || [];
    const demandasItems = specialCardsData?.demandasItems || [];
    const isLoading = specialCardsData?.isLoading || false;
    
    switch (card.dataSourceKey) {
      case 'ultimas_notas':
        return (
          <DynamicContentCard 
            items={notasItems} 
            type="notes" 
            isLoading={isLoading} 
          />
        );
        
      case 'ultimas_demandas':
        return (
          <DynamicContentCard 
            items={demandasItems} 
            type="demands" 
            isLoading={isLoading} 
          />
        );
        
      case 'estatisticas_gerais':
        if (isLoading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          );
        }
        
        // Create mock statistics data since we don't have actual statistics yet
        const mockStatistics = {
          demands: [
            { name: 'Pendentes', value: 25, color: '#3B82F6' },
            { name: 'Em andamento', value: 15, color: '#F59E0B' },
            { name: 'Concluídas', value: 45, color: '#10B981' }
          ],
          notes: [
            { name: 'Aprovadas', value: 30, color: '#10B981' },
            { name: 'Pendentes', value: 12, color: '#F59E0B' },
            { name: 'Rejeitadas', value: 8, color: '#EF4444' }
          ],
          news: [
            { name: 'Publicadas', value: 22, color: '#3B82F6' },
            { name: 'Rascunhos', value: 10, color: '#9CA3AF' }
          ]
        };
        
        // Create a dynamic charts view based on available statistics
        return (
          <div className="grid grid-cols-3 gap-4 p-4 h-full">
            <StatisticsCard 
              data={mockStatistics.demands} 
              title="Demandas por Status" 
              chartType="pie" 
            />
            <StatisticsCard 
              data={mockStatistics.notes} 
              title="Notas por Status" 
              chartType="bar" 
            />
            <StatisticsCard 
              data={mockStatistics.news} 
              title="Notícias" 
              chartType="pie" 
            />
          </div>
        );
    }
  }

  // Special handling for card types
  if (card.type) {
    switch (card.type) {
      case 'smart_search':
        return (
          <div className="p-4 flex items-center justify-center h-full">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = '/search';
              }}
            />
          </div>
        );

      // Add other card types as needed
    }
  }

  return null;
};

export default getSpecialContent;
