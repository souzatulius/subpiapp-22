
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import DynamicContentCard from '../../cards/DynamicContentCard';
import StatisticsCard from '../../cards/StatisticsCard';
import { useDynamicDashboardContent } from '@/hooks/dashboard/useDynamicDashboardContent';

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
    const { latestNotes, latestDemands, statistics, isLoading } = useDynamicDashboardContent();
    
    switch (card.dataSourceKey) {
      case 'ultimas_notas':
        return (
          <DynamicContentCard 
            items={latestNotes} 
            type="notes" 
            isLoading={isLoading} 
          />
        );
        
      case 'ultimas_demandas':
        return (
          <DynamicContentCard 
            items={latestDemands} 
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
        
        // Create a dynamic charts view based on available statistics
        return (
          <div className="grid grid-cols-3 gap-4 p-4 h-full">
            <StatisticsCard 
              data={statistics.demands} 
              title="Demandas por Status" 
              chartType="pie" 
            />
            <StatisticsCard 
              data={statistics.notes} 
              title="Notas por Status" 
              chartType="bar" 
            />
            <StatisticsCard 
              data={statistics.news} 
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
