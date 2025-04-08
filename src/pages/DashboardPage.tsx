
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
import SmartSearchCard from '@/components/dashboard/SmartSearchCard';
import PendingActionsCard from '@/components/dashboard/cards/PendingActionsCard';
import { ActionCardItem, CardHeight } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useScrollFade } from '@/hooks/useScrollFade';
import { motion } from 'framer-motion';
import { useCardStorage } from '@/hooks/dashboard/useCardStorage';
import { useSpecialCardsData } from '@/hooks/dashboard/useSpecialCardsData';
import { v4 as uuidv4 } from 'uuid';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const [searchCardAdded, setSearchCardAdded] = useState(false);
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
  const specialCardsData = useSpecialCardsData();

  const scrollFadeStyles = useScrollFade();

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
  };

  const handleSearchSubmit = (query: string) => {
    toast({
      title: "Pesquisa realizada",
      description: `Você pesquisou: ${query}`,
      variant: "default"
    });
  };

  const renderSpecialCardContent = (cardId: string, card?: ActionCardItem) => {
    if (card?.type === 'smart_search' || cardId === 'dashboard-search-card') {
      return <SmartSearchCard onSearch={handleSearchSubmit} />;
    }
    
    if (card?.isPendingActions || card?.type === 'in_progress_demands' || cardId === 'pending-actions-card') {
      return (
        <PendingActionsCard
          id={cardId}
          notesToApprove={specialCardsData.notesToApprove}
          responsesToDo={specialCardsData.responsesToDo}
          isComunicacao={specialCardsData.isComunicacao}
          userDepartmentId={specialCardsData.userCoordenaticaoId || ''}
        />
      );
    }
    
    return null;
  };

  useEffect(() => {
    if (cards && cards.length > 0 && !searchCardAdded) {
      // Define our standard dashboard cards
      const desiredCards: ActionCardItem[] = [
        // Search card (2 columns x 1 row)
        {
          id: 'dashboard-search-card',
          title: 'O que deseja fazer?',
          iconId: 'Search',
          path: '',
          color: 'bg-white',
          width: '50',
          height: '1',
          type: 'smart_search',
          isSearch: true,
          displayMobile: true,
          mobileOrder: 0
        },
        // Pending Actions card (2 columns x 2 rows)
        {
          id: 'pending-actions-card',
          title: 'Ações Pendentes',
          iconId: 'AlertTriangle',
          path: '',
          color: 'bg-orange-500',
          width: '50',
          height: '2',
          type: 'in_progress_demands',
          isPendingActions: true,
          displayMobile: true,
          mobileOrder: 1
        },
        // Nueva Demanda
        {
          id: uuidv4(),
          title: 'Nova Demanda',
          iconId: 'PenLine',
          path: '/dashboard/comunicacao/cadastrar',
          color: 'deep-blue',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 2
        },
        // Notas de Imprensa
        {
          id: uuidv4(),
          title: 'Notas de Imprensa',
          iconId: 'FileText',
          path: '/dashboard/comunicacao/notas',
          color: 'blue-light',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 3
        },
        // Notícias e Releases
        {
          id: uuidv4(),
          title: 'Notícias e Releases',
          iconId: 'Newspaper',
          path: '/dashboard/comunicacao/releases',
          color: 'orange-light',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 4
        },
        // Relatórios da Comunicação
        {
          id: uuidv4(),
          title: 'Relatórios da Comunicação',
          iconId: 'PieChart',
          path: '/dashboard/comunicacao/relatorios',
          color: 'blue-vivid',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 5
        },
        // Ranking da Zeladoria
        {
          id: uuidv4(),
          title: 'Ranking da Zeladoria',
          iconId: 'TrendingUp',
          path: '/dashboard/zeladoria/ranking-subs',
          color: 'green-neon',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 6
        },
        // Ajustes do Perfil
        {
          id: uuidv4(),
          title: 'Ajustes do Perfil',
          iconId: 'UserCog',
          path: '/profile',
          color: 'gray-medium',
          width: '25',
          height: '1',
          type: 'standard',
          displayMobile: true,
          mobileOrder: 7
        }
      ];
      
      // Replace existing cards with our desired layout
      handleCardsChange(desiredCards);
      setSearchCardAdded(true);
    }
  }, [cards, searchCardAdded, handleCardsChange]);

  if (!user) {
    return <LoadingIndicator message="Carregando..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFAFA]">
      <div className={`${isMobile ? 'transition-all duration-300' : ''}`}>
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto bg-[#FFFAFA]">
          {!isMobile && <BreadcrumbBar />}
          
          <motion.div 
            className="max-w-7xl mx-auto p-4"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              {isMobile && (
                <div className="mb-0">
                  <BreadcrumbBar />
                </div>
              )}
              
              <div className="w-full">
                <WelcomeCard 
                  title="Dashboard" 
                  description="Arraste e edite os cards para personalizar a sua tela" 
                  icon={<Home className="h-6 w-6 mr-2" />} 
                  color="bg-gradient-to-r from-blue-800 to-blue-950"
                  userName={firstName || ''}
                  greeting={true}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetDashboard}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  disabled={isSaving}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Resetar
                </Button>
              </div>
              
              <div className={`relative ${isMobile ? 'pb-32' : ''}`}>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : cards && cards.length > 0 && (
                  <div className="px-2 py-2">
                    <CardGridContainer 
                      cards={cards.filter(card => !card.isHidden)} 
                      onCardsChange={handleCardsChange}
                      onEditCard={handleCardEdit}
                      onHideCard={handleHideCard}
                      isMobileView={isMobile}
                      isEditMode={isEditMode}
                      onSearchSubmit={handleSearchSubmit}
                      specialCardsData={specialCardsData}
                      renderSpecialCardContent={renderSpecialCardContent}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
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
