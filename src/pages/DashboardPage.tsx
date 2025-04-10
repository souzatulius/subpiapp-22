import React, { useState, useEffect } from 'react';
import { Home, RotateCcw } from 'lucide-react';
import { useDashboardCards } from '@/hooks/dashboard/useDashboardCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/hooks/dashboard/useUserData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Header from '@/components/layouts/header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditCardModal from '@/components/dashboard/card-customization/EditCardModal';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useCardStorage } from '@/hooks/dashboard/useCardStorage';
import OriginsDemandChartCompact from '@/components/dashboard/cards/OriginsDemandChartCompact';
import OriginsDemandCardWrapper from '@/components/dashboard/cards/OriginsDemandCardWrapper';
import PendingTasksCard from '@/components/dashboard/cards/PendingTasksCard';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const {
    firstName,
    userCoordenaticaoId,
    isLoadingUser
  } = useUserData(user?.id);
  
  const {
    cards,
    isLoading,
    handleCardEdit: saveCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  } = useDashboardCards();

  const { saveCardConfig, isSaving } = useCardStorage(user, userCoordenaticaoId);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const handleSaveCard = async (updatedCard: Partial<ActionCardItem>) => {
    saveCardEdit(updatedCard as ActionCardItem);
    setIsEditCardModalOpen(false);
    
    if (user && cards) {
      const updatedCards = cards.map(card => 
        card.id === updatedCard.id ? { ...card, ...updatedCard } : card
      );
      
      await saveCardConfig(updatedCards);
    }
  };

  const handleCardsChange = async (updatedCards: ActionCardItem[]) => {
    handleCardsReorder(updatedCards);
    
    if (user) {
      await saveCardConfig(updatedCards);
    }
  };

  const handleHideCard = async (cardId: string) => {
    handleCardHide(cardId);
    
    if (user && cards) {
      const updatedCards = cards.map(card => 
        card.id === cardId ? { ...card, isHidden: true } : card
      );
      
      await saveCardConfig(updatedCards);
    }
  };

  const handleResetDashboard = async () => {
    resetDashboard();
    
    if (user) {
      const defaultCards = resetDashboard();
      await saveCardConfig(defaultCards);
    }
    
    toast({
      title: "Dashboard resetado",
      description: "O dashboard foi restaurado para a configuração padrão.",
      variant: "default"
    });
  };

  useEffect(() => {
    if (!cards || cards.length === 0) return;
    
    const searchCardExists = cards.some(card => card.id === 'dashboard-search-card');
    const originDemandCardExists = cards.some(card => card.id === 'origem-demandas-card' || card.type === 'origin_demand_chart');
    
    let updatedCards = [...cards];
    let needsUpdate = false;
    
    if (!searchCardExists) {
      const searchCard: ActionCardItem = {
        id: 'dashboard-search-card',
        title: 'Busca Rápida',
        iconId: 'Search',
        path: '',
        color: 'bg-white',
        width: '100',
        height: '0.5',
        type: 'smart_search',
        isSearch: true,
        displayMobile: true,
        mobileOrder: 1
      };
      
      updatedCards = [searchCard, ...updatedCards];
      needsUpdate = true;
    }
    
    if (!originDemandCardExists) {
      const originDemandCard: ActionCardItem = {
        id: 'origem-demandas-card',
        title: 'Atividades em Andamento',
        subtitle: 'Demandas da semana por área técnica',
        iconId: 'BarChart2',
        path: '',
        color: 'gray-light',
        width: isMobile ? '100' : '50',
        height: '2',
        type: 'origin_demand_chart',
        displayMobile: true,
        mobileOrder: 5
      };
      
      updatedCards = [...updatedCards, originDemandCard];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      handleCardsChange(updatedCards);
    }
  }, [cards, isMobile, handleCardsChange]);

  const renderSpecialCardContent = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    
    if (!card) return null;
    
    if (cardId === 'origem-demandas-card' || 
        cardId.includes('origem-demandas') || 
        cardId.includes('origemDemandas') ||
        cardId.includes('origin-demand-chart') ||
        cardId.includes('origin_demand_chart')) {
      return <OriginsDemandCardWrapper 
        className="w-full h-full" 
        color={card.color}
        title={card.title}
        subtitle={card.subtitle}
      />;
    }
    
    if (cardId === 'acoes-pendentes-card' || cardId.includes('acoes-pendentes') || card.isPendingTasks) {
      return <PendingTasksCard 
        id={card.id} 
        title={card.title} 
        userDepartmentId={userCoordenaticaoId} 
        isComunicacao={userCoordenaticaoId === 'comunicacao'} 
      />;
    }
    
    return null;
  };

  if (!user) {
    return <LoadingIndicator message="Carregando..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFFAFA]">
      <Header 
        showControls={true} 
        toggleSidebar={toggleSidebar} 
        className="flex-shrink-0" 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="h-full flex-shrink-0">
            <DashboardSidebar isOpen={sidebarOpen} />
          </div>
        )}
        
        <main className="flex-1 flex flex-col overflow-auto">
          {!isMobile ? (
            <BreadcrumbBar className="flex-shrink-0" />
          ) : (
            <div className="sticky top-0 z-10 bg-white">
              <BreadcrumbBar className="flex-shrink-0" />
            </div>
          )}
          
          <div className="flex-1 overflow-auto">
            <motion.div 
              className="max-w-7xl mx-auto p-4"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                <div className="w-full">
                  <WelcomeCard 
                    title="Dashboard" 
                    description="Arraste e edite os cards para personalizar a sua tela" 
                    icon={<Home className="h-6 w-6 mr-2" />} 
                    color="bg-gradient-to-r from-blue-800 to-blue-950"
                    userName={firstName || ''}
                    greeting={true}
                    showResetButton={true}
                    resetButtonIcon={<RotateCcw className="h-4 w-4" />}
                    onResetClick={handleResetDashboard}
                  />
                </div>
                
                <div className={`relative ${isMobile ? 'pb-32' : ''}`}>
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="h-32 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : cards && cards.length > 0 ? (
                    <div className="px-2 py-2">
                      <CardGridContainer 
                        cards={cards.filter(card => !card.isHidden)} 
                        onCardsChange={handleCardsChange}
                        onEditCard={handleCardEdit}
                        onHideCard={handleHideCard}
                        isMobileView={isMobile}
                        isEditMode={isEditMode}
                        renderSpecialCardContent={renderSpecialCardContent}
                        showSpecialFeatures={true}
                      />
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Nenhum card disponível.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {selectedCard && (
        <EditCardModal
          isOpen={isEditCardModalOpen}
          onClose={() => setIsEditCardModalOpen(false)}
          onSave={handleSaveCard}
          card={selectedCard}
        />
      )}
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardPage;
