
import React, { useState, useRef, useEffect } from 'react';
import { X, Grip, Maximize2, Minimize2 } from 'lucide-react';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';

interface DraggableCardLibraryProps {
  onAddCardToDashboard: (card: ActionCardItem) => void;
}

const DraggableCardLibrary: React.FC<DraggableCardLibraryProps> = ({ onAddCardToDashboard }) => {
  const { availableCards, isLoading } = useAvailableCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const libraryRef = useRef<HTMLDivElement>(null);

  const filteredCards = availableCards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.subtitle && card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle drag motion
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleFloating = () => {
    setIsFloating(!isFloating);
  };

  const handleCardDragStart = (card: ActionCardItem) => (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Fix: Type check before accessing classList
    const target = e.target;
    if (target instanceof HTMLElement) {
      // This helps maintain the visual during drag
      setTimeout(() => {
        target.classList.add('opacity-50');
      }, 0);
    }
  };
  
  const handleCardDragEnd = (e: React.DragEvent) => {
    // Fix: Type check before accessing classList
    const target = e.target;
    if (target instanceof HTMLElement) {
      target.classList.remove('opacity-50');
    }
  };

  // Renderizar cards da biblioteca de forma independente sem usar UnifiedCardGrid
  const renderLibraryCards = () => {
    return (
      <div className={`grid ${expanded ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
        {filteredCards.map(card => (
          <div 
            key={card.id} 
            draggable 
            onDragStart={handleCardDragStart(card)}
            onDragEnd={handleCardDragEnd}
            className="cursor-grab active:cursor-grabbing transition-transform hover:scale-105"
          >
            <div className="card-preview relative aspect-[3/2] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="absolute inset-0 p-3 flex flex-col" style={{transform: 'scale(0.9)'}}>
                <div className={`w-full h-full rounded-md flex items-center p-3 ${getCardColorClass(card.color)}`}>
                  <div className="flex items-center">
                    {renderCardIcon(card)}
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-white truncate">{card.title}</h3>
                      {card.subtitle && (
                        <p className="text-xs text-white/80 truncate">{card.subtitle}</p>
                      )}
                    </div>
                  </div>
                  {card.hasBadge && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {card.badgeValue || '!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Função auxiliar para renderizar o ícone do card
  const renderCardIcon = (card: ActionCardItem) => {
    const IconComponent = getIconComponentFromId(card.iconId);
    if (!IconComponent) return null;
    
    return <IconComponent className="h-5 w-5 text-white" />;
  };

  // Função auxiliar para obter a classe de cor do card
  const getCardColorClass = (color: string): string => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-500';
      case 'gray-light': return 'bg-gray-200 text-gray-800';
      case 'gray-dark': return 'bg-gray-700';
      case 'blue-dark': return 'bg-blue-700';
      case 'orange-light': return 'bg-orange-300';
      case 'gray-ultra-light': return 'bg-gray-100';
      case 'lime': return 'bg-lime-500';
      case 'orange-600': return 'bg-orange-600';
      case 'blue-light': return 'bg-blue-400';
      case 'green-light': return 'bg-green-400';
      case 'purple-light': return 'bg-purple-400';
      default: return 'bg-blue-500';
    }
  };

  const renderCardLibraryContent = () => (
    <div className="space-y-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Buscar cards..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className={`rounded-md border border-gray-200 bg-gray-50 p-4 ${expanded ? 'h-[600px]' : 'h-[400px]'} overflow-y-auto`}>
        {isLoading ? (
          <div className="p-4 text-center">Carregando biblioteca de cards...</div>
        ) : filteredCards.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhum card encontrado com o termo "{searchTerm}"
          </div>
        ) : (
          renderLibraryCards()
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Arraste os cards para o dashboard para adicioná-los
      </div>
    </div>
  );
  
  if (isFloating) {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 right-4 z-50 shadow-lg"
          onClick={toggleFloating}
        >
          Mostrar Biblioteca
        </Button>
        
        <div
          ref={libraryRef}
          className={`fixed shadow-xl rounded-lg z-40 bg-white border border-gray-200 ${expanded ? 'w-[800px]' : 'w-[500px]'} overflow-hidden`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transform: 'translate3d(0,0,0)', // Force GPU acceleration
          }}
        >
          <div 
            className="bg-blue-600 text-white p-2 flex items-center justify-between cursor-move drag-handle"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center">
              <Grip className="h-4 w-4 mr-2" />
              <h3 className="font-medium text-sm">Biblioteca de Cards</h3>
            </div>
            <div className="flex items-center space-x-1">
              {expanded ? (
                <Minimize2 className="h-4 w-4 cursor-pointer" onClick={toggleExpand} />
              ) : (
                <Maximize2 className="h-4 w-4 cursor-pointer" onClick={toggleExpand} />
              )}
              <X className="h-4 w-4 cursor-pointer" onClick={toggleFloating} />
            </div>
          </div>
          <div className="p-4">
            {renderCardLibraryContent()}
          </div>
        </div>
      </>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Biblioteca de Cards</CardTitle>
        <Button variant="outline" size="sm" onClick={toggleFloating}>
          Desacoplar
        </Button>
      </CardHeader>
      <CardContent>
        {renderCardLibraryContent()}
      </CardContent>
    </Card>
  );
};

export default DraggableCardLibrary;
