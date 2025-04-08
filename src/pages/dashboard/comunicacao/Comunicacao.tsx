import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/dashboard/useUserData';
import EditCardModal from '@/components/dashboard/EditCardModal';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useComunicacaoDashboard } from '@/hooks/dashboard/useComunicacaoDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SmartSearchCard from '@/components/dashboard/SmartSearchCard';
import OriginSelectionCard from '@/components/comunicacao/OriginSelectionCard';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const isMobile = useIsMobile();
  
  const {
    cards,
    isEditMode,
    isEditModalOpen,
    selectedCard,
    isLoading,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard
  } = useComunicacaoDashboard(user, isPreview, department);

  React.useEffect(() => {
    if (cards.length > 0) {
      const updatedCards = cards.map(card => {
        // Keep all cards at normal height except the search card
        if (card.id === 'comunicacao-search-card') {
          return { ...card, height: '0.5' as CardHeight };
        }
        return { ...card };
      });
      
      const hasSearchCard = updatedCards.some(card => card.id === 'comunicacao-search-card');
      const hasOriginCard = updatedCards.some(card => card.title === 'Cadastrar Demanda');
      
      if (!hasSearchCard) {
        const searchCard = {
          id: 'comunicacao-search-card',
          title: 'Busca Rápida',
          iconId: 'search',
          path: '',
          color: 'bg-white' as CardColor,
          width: '100' as CardWidth,
          height: '0.5' as CardHeight,
          type: 'smart_search' as CardType,
          isCustom: true,
          displayMobile: true,
          mobileOrder: 0
        };
        
        updatedCards.splice(1, 0, searchCard);
      }
      
      if (!hasOriginCard) {
        const originCard = {
          id: 'comunicacao-origin-card',
          title: 'Cadastrar Demanda',
          subtitle: 'De onde vem a solicitação?',
          iconId: 'MessageSquare',
          path: '',
          color: 'bg-blue-500' as CardColor,
          width: '50' as CardWidth,
          height: '1' as CardHeight,
          type: 'origin_selection' as CardType,
          isCustom: true,
          displayMobile: true,
          mobileOrder: 2
        };
        
        updatedCards.splice(2, 0, originCard);
      }
      
      if (JSON.stringify(updatedCards) !== JSON.stringify(cards)) {
        handleCardsReorder(updatedCards);
      }
    }
  }, [cards]);

  const handleResetDashboard = () => {
    resetDashboard();
    toast({
      title: "Dashboard resetado",
      description: "O dashboard de comunicação foi restaurado para a configuração padrão.",
      variant: "default"
    });
  };

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  const renderCardContent = (cardId: string, cardType?: string) => {
    if (cardId === 'comunicacao-search-card') {
      return <SmartSearchCard placeholder="O que deseja fazer?" />;
    }
    if (cardType === 'origin_selection' || cardId === 'comunicacao-origin-card') {
      return <OriginSelectionCard />;
    }
    return null;
  };

  return (
    <div className="space-y-6 bg-[#FFFAFA]">
      <div className="w-full mb-2">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-[#0066FF] to-blue-700"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetDashboard}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Resetar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        cards && cards.length > 0 ? (
          <div className="px-2 py-2">
            <CardGridContainer
              cards={cards}
              onCardsChange={handleCardsReorder}
              onEditCard={handleCardEdit}
              onHideCard={handleCardHide}
              isMobileView={isMobile}
              isEditMode={isEditMode}
              renderSpecialCardContent={(cardId, card) => renderCardContent(cardId, card?.type)}
            />
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhum card disponível.
          </div>
        )
      )}
      
      {selectedCard && (
        <EditCardModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCardEdit}
          card={selectedCard}
        />
      )}
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
