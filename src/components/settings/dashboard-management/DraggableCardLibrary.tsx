
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAvailableCards } from '@/hooks/dashboard/defaultCards';
import ActionCard from '@/components/dashboard/ActionCard';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { SearchIcon, ChevronDown, ChevronRight } from 'lucide-react';
import DraggableCard from './DraggableCard';

interface DraggableCardLibraryProps {
  onAddCardToDashboard: (card: ActionCardItem) => void;
}

const DraggableCardLibrary: React.FC<DraggableCardLibraryProps> = ({ onAddCardToDashboard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const availableCards = useMemo(() => getAvailableCards(), []);

  // Group cards by category
  const cardsByCategory = useMemo(() => {
    return availableCards.reduce((acc: Record<string, ActionCardItem[]>, card) => {
      const category = card.type || 'standard';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(card);
      return acc;
    }, {});
  }, [availableCards]);

  // Expand all categories by default
  useEffect(() => {
    const allCategories = Object.keys(cardsByCategory);
    const initialExpandedState = allCategories.reduce((acc: Record<string, boolean>, category) => {
      acc[category] = true; // All expanded initially
      return acc;
    }, {});
    setExpandedCategories(initialExpandedState);
  }, [cardsByCategory]);

  // Filter cards based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return cardsByCategory;
    
    const filtered: Record<string, ActionCardItem[]> = {};
    
    Object.entries(cardsByCategory).forEach(([category, cards]) => {
      const matchingCards = cards.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.subtitle && card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (matchingCards.length > 0) {
        filtered[category] = matchingCards;
      }
    });
    
    return filtered;
  }, [cardsByCategory, searchTerm]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Handle drag start on a card
  const handleCardDragStart = (event: React.DragEvent, card: ActionCardItem) => {
    if (event.target instanceof HTMLElement) {
      event.target.classList.add('opacity-50');
    }
    
    // Set drag data
    event.dataTransfer.setData('application/json', JSON.stringify(card));
    event.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drag end
  const handleCardDragEnd = (event: React.DragEvent) => {
    if (event.target instanceof HTMLElement) {
      event.target.classList.remove('opacity-50');
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'standard': return 'Cards Padrão';
      case 'data_dynamic': return 'Cards Dinâmicos';
      case 'special': return 'Cards Especiais';
      case 'smart_search': return 'Busca Inteligente';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          className="pl-8"
          placeholder="Pesquisar cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Nenhum card encontrado para "{searchTerm}"
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, cards]) => (
            <Card key={category} className="overflow-hidden">
              <div 
                className="bg-gray-50 p-2 border-b cursor-pointer flex justify-between items-center"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="font-medium text-sm flex items-center">
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  {getCategoryDisplayName(category)}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {cards.length}
                </Badge>
              </div>
              
              {expandedCategories[category] && (
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    {cards.map((card) => (
                      <div 
                        key={card.id} 
                        className="transform scale-50 origin-top-left h-32" // Use scale transform for visual sizing
                        draggable
                        onDragStart={(e) => handleCardDragStart(e, card)}
                        onDragEnd={handleCardDragEnd}
                        onDoubleClick={() => onAddCardToDashboard(card)}
                      >
                        <div className="w-[200%] h-[200%]"> {/* Double size container to counteract the 50% scale */}
                          <ActionCard
                            id={card.id}
                            title={card.title}
                            iconId={card.iconId}
                            path={card.path}
                            color={card.color as CardColor}
                            width={card.width}
                            height={card.height}
                            type={card.type}
                            dataSourceKey={card.dataSourceKey}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DraggableCardLibrary;
