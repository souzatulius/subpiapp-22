
import React, { useState, useRef, useEffect } from 'react';
import { X, Grip, Maximize2, Minimize2 } from 'lucide-react';
import { useAvailableCards } from '@/hooks/dashboard-management/useAvailableCards';
import { ActionCardItem } from '@/types/dashboard';
import UnifiedCardGrid from '@/components/dashboard/UnifiedCardGrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
          <div className={`grid ${expanded ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
            {filteredCards.map(card => (
              <div 
                key={card.id} 
                draggable 
                onDragStart={handleCardDragStart(card)}
                className="cursor-grab active:cursor-grabbing h-[120px]"
              >
                <UnifiedCardGrid
                  cards={[card]}
                  onCardsChange={() => {}}
                  disableWiggleEffect={true}
                  showSpecialFeatures={false}
                  isEditMode={false}
                />
              </div>
            ))}
          </div>
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
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
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
