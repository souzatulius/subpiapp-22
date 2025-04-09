
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
import { toast } from '@/hooks/use-toast';
import { ActionCardItem, CardColor } from '@/types/dashboard';
import { useOriginOptions } from '@/hooks/dashboard-management/useOriginOptions';
import { useOrigens } from '@/hooks/comunicacao/useOrigens';
import { useOriginIcon } from '@/hooks/useOriginIcon';
import OriginsDemandChartCompact from '@/components/dashboard/cards/OriginsDemandChartCompact';

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
      
      const filteredCards = updatedCards.filter(card => 
        card.id !== 'comunicacao-search-card' && 
        card.type !== 'smart_search'
      );
      
      const hasOriginSelectionCard = filteredCards.some(card => card.type === 'origin_selection');
      
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
          mobileOrder: filteredCards.length
        };
        
        filteredCards.push(originCard);
      }
      
      const hasOriginDemandChart = filteredCards.some(card => card.type === 'origin_demand_chart');
      
      if (!hasOriginDemandChart) {
        const chartCard: ActionCardItem = {
          id: 'origem-demandas-card',
          title: 'Origem das Demandas',
          iconId: 'PieChart',
          path: '',
          color: 'bg-white',
          width: '50',
          height: '2',
          type: 'origin_demand_chart',
          displayMobile: true,
          mobileOrder: filteredCards.length + 1
        };
        
        filteredCards.push(chartCard);
      }
      
      if (JSON.stringify(filteredCards) !== JSON.stringify(cards)) {
        handleCardsReorder(filteredCards);
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

  // Função para renderizar conteúdo especial baseado no ID do card
  const renderSpecialCardContent = (cardId: string) => {
    if (cardId === 'origem-demandas-card' || cardId.includes('origem-demandas')) {
      return <OriginsDemandChartCompact className="w-full h-full" />;
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
          showResetButton={true}
          resetButtonIcon={<RotateCcw className="h-4 w-4" />}
          onResetClick={handleResetDashboard}
        />
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
              specialCardsData={specialData}
              disableWiggleEffect={true}
              showSpecialFeatures={true}
              renderSpecialCardContent={renderSpecialCardContent}
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
