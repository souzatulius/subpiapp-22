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
import { Button } from '@/components/ui/button';
import { useScrollFade } from '@/hooks/useScrollFade';
import { motion } from 'framer-motion';
import { useCardStorage } from '@/hooks/dashboard/useCardStorage';
import { v4 as uuidv4 } from 'uuid';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  const isMobile = useIsMobile();
  const {
    user
  } = useAuth();
  
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

  // Add a reference to the card storage
  const { saveCardConfig } = useCardStorage(user, userCoordenaticaoId);

  const scrollFadeStyles = useScrollFade();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Add search card if it doesn't exist
  useEffect(() => {
    if (!isLoading && cards && !cards.some(card => card.isSearch)) {
      const updatedCards = [...cards];
      
      // Create search card
      const searchCard: ActionCardItem = {
        id: `search-${uuidv4()}`,
        title: "O que vamos fazer?",
        iconId: "search",
        path: "",
        color: "blue-light",
        width: "100",
        height: "1",
        type: "smart_search",
        isSearch: true,
        displayMobile: true,
        mobileOrder: 0,
      };
      
      // Add to beginning
      updatedCards.unshift(searchCard);
      handleCardsReorder(updatedCards);
    }
  }, [isLoading, cards]);

  const handleCardEdit = (card: ActionCardItem) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const handleSaveCard = (updatedCard: Partial<ActionCardItem>) => {
    saveCardEdit(updatedCard as ActionCardItem);
    setIsEditCardModalOpen(false);
    toast({
      title: "Card atualizado",
      description: "As alterações foram salvas com sucesso.",
      variant: "default"
    });
  };

  const handleCardsChange = async (updatedCards: ActionCardItem[]) => {
    // First update the local state
    handleCardsReorder(updatedCards);
    
    // Then save to database using the useCardStorage hook
    if (user) {
      const saved = await saveCardConfig(updatedCards);
      if (!saved) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a posição dos cards.",
          variant: "destructive"
        });
      }
    }
  };

  const handleResetDashboard = () => {
    resetDashboard();
    toast({
      title: "Dashboard resetado",
      description: "O seu dashboard foi restaurado para a configuração padrão.",
      variant: "default"
    });
  };

  const handleSearchSubmit = (query: string) => {
    console.log('Search submitted:', query);
    // This will be handled by the SmartSearchCard component
  };

  if (!user) {
    return <LoadingIndicator message="Carregando..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className={`${isMobile ? 'transition-all duration-300' : ''}`}>
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className={`flex-1 overflow-auto`}>
          {!isMobile && <BreadcrumbBar />}
          
          <motion.div 
            className="max-w-7xl mx-auto p-4"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              {/* Mobile breadcrumb now placed BEFORE WelcomeCard */}
              {isMobile && (
                <div className="w-full bg-white rounded-md shadow-sm">
                  <BreadcrumbBar />
                </div>
              )}
              
              <div className="w-full">
                {/* WelcomeCard component */}
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
                ) : cards && cards.length > 0 ? (
                  <div className="px-2 py-2">
                    <CardGridContainer 
                      cards={cards.filter(card => !card.isHidden)} 
                      onCardsChange={handleCardsChange}
                      onEditCard={handleCardEdit}
                      onHideCard={handleCardHide}
                      isMobileView={isMobile}
                      isEditMode={isEditMode}
                      onSearchSubmit={handleSearchSubmit}
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
