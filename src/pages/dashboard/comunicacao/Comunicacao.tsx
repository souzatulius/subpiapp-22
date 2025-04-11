
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
import PressRequestCard from '@/components/dashboard/cards/PressRequestCard';
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
  const formattedLastSaved = useMemo(() => {
    return lastSaved 
      ? format(lastSaved, 'dd/MM/yyyy HH:mm:ss')
      : null;
  }, [lastSaved]);

  // Define all rendering functions outside of the render logic with useCallback
  const renderSpecialCardContent = useCallback((cardId: string) => {
    if (typeof cardId !== 'string') return null;
    
    const foundCard = cards.find(c => c.id === cardId);
    
    if (cardId === 'origem-demandas-card' || 
        cardId.includes('origem-demandas') || 
        cardId.includes('origemDemandas') || 
        cardId.includes('origin-demand-chart')) {
      return <OriginsDemandChartCompact 
        className="w-full h-full" 
        color={foundCard?.color} 
        title={foundCard?.title} 
        subtitle={foundCard?.subtitle} 
      />;
    }
    
    if (cardId === 'press-request-card' || cardId.includes('press-request')) {
      return <PressRequestCard />;
    }
    
    if (cardId === 'acoes-pendentes-card' || 
        cardId.includes('acoes-pendentes') || 
        (foundCard && foundCard.isPendingTasks) || 
        (foundCard && foundCard.type === 'pending_tasks')) {
      return <PendingTasksCard 
        id={cardId} 
        title={foundCard?.title || 'Ações Pendentes'} 
        userDepartmentId={specialCardsData.coordenacaoId} 
        isComunicacao={true} 
      />;
    }
    
    return null;
  }, [cards, specialCardsData.coordenacaoId]);

  // Use useMemo for card processing to prevent unnecessary re-renders
  const processedCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    
    const visibleCards = cards.filter(card => !card.isHidden);
    return visibleCards;
  }, [cards]);

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
  const handleManualSave = useCallback(() => {
    saveNow();
  }, [saveNow]);

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

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
      
      {/* Save status indicator - only render if there's save information to show */}
      {!isPreview && user && (isSaving || lastSaved || hasUnsavedChanges) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-sm">
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
            ) : null}
          </div>
          {hasUnsavedChanges && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              onClick={handleManualSave}
            >
              <Save className="h-4 w-4 mr-1" /> Salvar alterações
            </Button>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        processedCards.length > 0 ? (
          <div className="px-2 py-2">
            <CardGridContainer
              cards={processedCards}
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
