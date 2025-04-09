
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
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { useOriginOptions } from '@/hooks/dashboard-management/useOriginOptions';
import { useOrigens } from '@/hooks/comunicacao/useOrigens';
import { useOriginIcon } from '@/hooks/useOriginIcon';

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
  const { originOptions } = useOriginOptions();
  
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

  // Update card titles and handle special cards
  React.useEffect(() => {
    if (cards.length > 0) {
      const updatedCards = cards.map(card => {
        if (card.title === 'Notícias' && card.color === 'bg-yellow-500') {
          return { ...card, title: 'Cadastrar Release' };
        }
        if (card.title === 'Notícias' && card.color === 'bg-gray-500') {
          return { ...card, title: 'Ver Releases e Notícias' };
        }
        if (card.title === 'Criar Nota') {
          return { ...card, title: 'Criar Nota de Imprensa' };
        }
        return card;
      });
      
      // Check if search card exists, otherwise add it
      const hasSearchCard = updatedCards.some(card => card.id === 'comunicacao-search-card');
      
      if (!hasSearchCard) {
        const searchCard: ActionCardItem = {
          id: 'comunicacao-search-card',
          title: 'Busca Rápida',
          iconId: 'search',
          path: '',
          color: 'bg-white' as CardColor,
          width: '100',
          height: '0.5',
          type: 'smart_search',
          isCustom: true,
          displayMobile: true,
          mobileOrder: 0
        };
        
        // Insert after the reset button (as second item)
        updatedCards.splice(1, 0, searchCard);
      }
      
      // Check if we have the origin selection card
      const hasOriginSelectionCard = updatedCards.some(card => card.type === 'origin_selection');
      
      if (!hasOriginSelectionCard) {
        const originCard: ActionCardItem = {
          id: 'origin-selection-card',
          title: 'Cadastro de nova solicitação de imprensa',
          iconId: 'Newspaper',
          path: '',
          color: 'bg-white',
          width: '50',
          height: '2',
          type: 'origin_selection',
          displayMobile: true,
          mobileOrder: updatedCards.length
        };
        
        updatedCards.push(originCard);
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

  const handleSearchSubmit = (query: string) => {
    console.log("Search submitted:", query);
    // Here you would implement your search logic
  };

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  // Helper to render specific card content based on type
  const renderCardContent = (cardId: string) => {
    if (cardId === 'comunicacao-search-card') {
      return (
        <div className="w-full h-full flex items-center justify-center px-4">
          <div className="w-[80%]">
            <SmartSearchCard 
              placeholder="O que deseja fazer?" 
              onSearch={handleSearchSubmit}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const specialData = {
    originOptions: originOptions
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

      {/* Reset dashboard button with updated text */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleResetDashboard}
          className="text-blue-600 border-blue-300 hover:bg-blue-50 py-4"
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
              renderSpecialCardContent={renderCardContent}
              onSearchSubmit={handleSearchSubmit}
              specialCardsData={specialData}
              disableWiggleEffect={true}
              showSpecialFeatures={true}
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
