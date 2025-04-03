
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CardLibrary from './CardLibrary';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/components/ui/use-toast';

const DashboardCardLibrary: React.FC = () => {
  const { availableCards, isLoading } = useAvailableCards();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddCardToDashboard = (card: ActionCardItem) => {
    // This would normally add the card to the dashboard
    // For now just show a toast message
    toast({
      title: "Card adicionado",
      description: `O card "${card.title}" foi adicionado ao dashboard`,
      variant: "success"
    });
  };

  const filteredCards = availableCards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.subtitle && card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Biblioteca de Cards</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar cards..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="p-4 text-center">Carregando biblioteca de cards...</div>
          ) : (
            <CardLibrary 
              availableCards={filteredCards} 
              onAddCardToDashboard={handleAddCardToDashboard} 
            />
          )}
        </CardContent>
      </Card>
      
      <p className="text-sm text-gray-500">
        Arraste os cards para o dashboard ou clique para adicionar
      </p>
    </div>
  );
};

export default DashboardCardLibrary;
