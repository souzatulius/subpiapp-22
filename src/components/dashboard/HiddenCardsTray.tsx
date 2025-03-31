
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { ActionCardItem } from '@/types/dashboard';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface HiddenCardsTrayProps {
  hiddenCards: ActionCardItem[];
  onShowCard: (cardId: string) => void;
}

const HiddenCardsTray: React.FC<HiddenCardsTrayProps> = ({ 
  hiddenCards, 
  onShowCard 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (hiddenCards.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-2">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-md bg-white shadow-sm"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex justify-between w-full px-4 py-2 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <EyeOff className="w-4 h-4 mr-2 text-gray-500" />
              <span>Cards ocultos ({hiddenCards.length})</span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {hiddenCards.map(card => {
              const IconComponent = getIconComponentFromId(card.iconId);
              return (
                <button
                  key={card.id}
                  onClick={() => onShowCard(card.id)}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center mb-1">
                    {IconComponent && <IconComponent className="w-4 h-4 mr-1 text-gray-600" />}
                    <span className="text-sm font-medium truncate max-w-[100px]">{card.title}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>Mostrar</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HiddenCardsTray;
