
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import { MoveHorizontal, ArrowRight } from 'lucide-react';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

// Import getBackgroundColor function directly from the ActionCard file
// since it's exported as a named export
interface CardLibraryProps {
  availableCards: ActionCardItem[];
  onAddCardToDashboard: (card: ActionCardItem) => void;
}

const CardLibrary: React.FC<CardLibraryProps> = ({ 
  availableCards, 
  onAddCardToDashboard 
}) => {
  if (!availableCards || availableCards.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        Nenhum card disponível na biblioteca.
      </div>
    );
  }

  // Function to get background color based on card color
  const getBackgroundColor = (color: string): string => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-500';
      case 'gray-light': return 'bg-gray-200';
      case 'gray-dark': return 'bg-gray-700';
      case 'blue-dark': return 'bg-blue-700';
      case 'orange-light': return 'bg-orange-300';
      case 'gray-ultra-light': return 'bg-gray-100';
      case 'lime': return 'bg-lime-500';
      case 'orange-600': return 'bg-orange-600';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <MoveHorizontal className="mr-2 h-5 w-5" /> 
        Biblioteca de Cards
      </h3>
      <div className="p-2 border border-gray-200 rounded-lg bg-white max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {availableCards.map((card) => {
            const IconComponent = getIconComponentFromId(card.iconId);
            const bgColorClass = getBackgroundColor(card.color);
            
            return (
              <div 
                key={card.id + "-library"} 
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md group cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(card));
                }}
                onClick={() => onAddCardToDashboard(card)}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${bgColorClass}`}>
                  {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-xs text-gray-500 truncate">{card.path}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                {card.type === 'data_dynamic' && (
                  <div className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Dinâmico
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-xs text-gray-500 italic">
        Arraste os cards para o dashboard ou clique para adicionar
      </div>
    </div>
  );
};

export default CardLibrary;
