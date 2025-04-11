
import React, { useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { MessageSquareReply, RotateCcw, Save } from 'lucide-react';
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
import OriginsDemandChartCompact from '@/components/dashboard/cards/OriginsDemandChartCompact';
import PendingTasksCard from '@/components/dashboard/cards/PendingTasksCard';
import PressRequestQuickStartCard from '@/components/comunicacao/PressRequestQuickStartCard';
import { ActionCardItem } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

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
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen,
    handleCardsReorder,
    resetDashboard,
    saveNow,
    specialCardsData
  } = useComunicacaoDashboard(user, isPreview, department);

  // Format last saved date for display
  const formattedLastSaved = lastSaved 
    ? format(lastSaved, 'dd/MM/yyyy HH:mm:ss')
    : null;

  // Use useMemo for card processing to prevent unnecessary re-renders
  const processedCards = useMemo(() => {
    if (cards.length === 0) return [];
    
    const updatedCards = cards.map(card => {
      if (card.title === 'Notícias' && card.color === 'bg-yellow-500') {
        return { ...card, title: 'Cadastrar Release' };
      }
      if (card.title === 'Notícias' && card.color === 'bg-gray-500') {
        return { ...card, title: 'Releases e Notícias' };
      }
      if (card.title === 'Criar Nota') {
        return { ...card, title: 'Criar Nota de Imprensa' };
      }
      return card;
    });
    
    const filteredCards = updatedCards.filter(card => 
      card.id !== 'comunicacao-search-card' && 
      card.type !== 'smart_search' &&
      card.title !== 'Origem das Demandas' &&
      !card.isPendingActions
    );
    
    // Add required cards if they don't exist
    const hasESICCard = filteredCards.some(card => 
      card.title === 'Processos e-SIC' || 
      card.path.includes('/esic')
    );
    
    if (!hasESICCard) {
      const esicCard: ActionCardItem = {
        id: 'esic-card',
        title: 'Processos e-SIC',
        iconId: 'FileSearch',
        path: '/dashboard/esic',
        color: 'deep-blue',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: filteredCards.length
      };
      
      filteredCards.push(esicCard);
    }
    
    const hasReleasesCard = filteredCards.some(card => 
      card.title === 'Releases e Notícias' || 
      card.path.includes('/releases')
    );
    
    if (!hasReleasesCard) {
      const releasesCard: ActionCardItem = {
        id: 'releases-card',
        title: 'Releases e Notícias',
        iconId: 'Newspaper',
        path: '/dashboard/comunicacao/releases',
        color: 'blue-light',
        width: '25',
        height: '2',
        type: 'standard',
        displayMobile: true,
        mobileOrder: filteredCards.length + 1
      };
      
      filteredCards.push(releasesCard);
    }
    
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
    
    const hasOriginDemandChart = filteredCards.some(card => 
      card.type === 'origin_demand_chart' || 
      card.title === 'Atividades em Andamento'
    );
    
    if (!hasOriginDemandChart) {
      const chartCard: ActionCardItem = {
        id: 'origem-demandas-card',
        title: 'Atividades em Andamento',
        subtitle: 'Demandas da semana por área técnica',
        iconId: 'BarChart2',
        path: '',
        color: 'gray-light',
        width: '50',
        height: '2',
        type: 'origin_demand_chart',
        displayMobile: true,
        mobileOrder: filteredCards.length + 1
      };
      
      filteredCards.push(chartCard);
    }
    
    return filteredCards;
  }, [cards]);

  // Fix the Hook Error: Use useEffect with proper dependency tracking
  useEffect(() => {
    if (cards.length > 0 && processedCards.length > 0 && 
        JSON.stringify(processedCards) !== JSON.stringify(cards)) {
      handleCardsReorder(processedCards);
    }
  }, [cards, processedCards, handleCardsReorder]);

  // Creating a memoized function to handle reset dashboard
  const handleResetDashboard = useCallback(() => {
    resetDashboard();
    toast({
      title: "Dashboard resetado",
      description: "O dashboard de comunicação foi restaurado para a configuração padrão.",
      variant: "default"
    });
  }, [resetDashboard]);
  
  // Creating a memoized function to handle manual save
  const handleManualSave = useCallback(async () => {
    await saveNow();
  }, [saveNow]);

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  // Memoize the special content renderer function to prevent unnecessary re-renders
  const renderSpecialCardContent = useCallback((card: string | ActionCardItem) => {
    if (typeof card === 'string') {
      const foundCard = cards.find(c => c.id === card);
      
      if (card === 'origem-demandas-card' || card.includes('origem-demandas') || 
          card.includes('origemDemandas') || card.includes('origin-demand-chart')) {
        return <OriginsDemandChartCompact 
          className="w-full h-full" 
          color={foundCard?.color} 
          title={foundCard?.title} 
          subtitle={foundCard?.subtitle} 
        />;
      }
      
      if (card === 'press-request-card' || card.includes('press-request')) {
        return <PressRequestQuickStartCard />;
      }
    } else if (card.type === 'origin_demand_chart') {
      return <OriginsDemandChartCompact 
        className="w-full h-full" 
        color={card.color} 
        title={card.title} 
        subtitle={card.subtitle} 
      />;
    } else if (card.type === 'press_request_card') {
      return <PressRequestQuickStartCard />;
    }
    
    return null;
  }, [cards]);

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
      
      {/* Save status indicator */}
      {!isPreview && user && (
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-md shadow-sm">
          <div className="text-sm text-gray-600">
            {isSaving ? (
              <span className="flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></span>
                Salvando alterações...
              </span>
            ) : lastSaved ? (
              <span>
                Última alteração salva: {formattedLastSaved}
              </span>
            ) : (
              <span>Dashboard carregado</span>
            )}
          </div>
          {hasUnsavedChanges && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleManualSave}
            >
              <Save className="h-4 w-4 mr-1" /> Salvar alterações
            </Button>
          )}
        </div>
      )}
      
      {/* Press Request Quick Start Card - Always visible, but memoized to prevent re-renders */}
      <div className="px-2">
        <PressRequestQuickStartCard />
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
              specialCardsData={specialCardsData}
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
