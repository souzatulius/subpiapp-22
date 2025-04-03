
import React, { useState, useEffect } from 'react';
import CardLibrary from './CardLibrary';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { ActionCardItem } from '@/types/dashboard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DraggableCardLibraryProps {
  onAddCardToDashboard: (card: ActionCardItem) => void;
}

const DraggableCardLibrary: React.FC<DraggableCardLibraryProps> = ({ 
  onAddCardToDashboard 
}) => {
  const { availableCards, isLoading } = useAvailableCards();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter cards based on search term
  const filteredCards = availableCards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.subtitle && card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar cards..."
          className="w-full pl-9 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="p-4 text-center">Carregando biblioteca de cards...</div>
      ) : (
        <CardLibrary 
          availableCards={filteredCards} 
          onAddCardToDashboard={onAddCardToDashboard} 
        />
      )}
    </div>
  );
};

export default DraggableCardLibrary;
