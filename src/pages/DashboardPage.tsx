
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
    userCoordenaticaoId
  } = useUserData();
  const {
    cards,
    isLoading,
    handleCardEdit: saveCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  } = useDashboardCards(userCoordenaticaoId);

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

  const handleSaveCard = (updatedCard: Partial<ActionCardItem>) => {
    saveCardEdit(updatedCard as ActionCardItem);
    setIsEditCardModalOpen(false);
    toast({
      title: "Card atualizado",
      description: "As alterações foram salvas com sucesso.",
      variant: "default"
    });
  };

  const handleResetDashboard = () => {
    resetDashboard();
    toast({
      title: "Dashboard resetado",
      description: "O seu dashboard foi restaurado para a configuração padrão.",
      variant: "default"
    });
  };

  if (!user) {
    return <LoadingIndicator message="Carregando..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white">
          <BreadcrumbBar />
        </div>
      )}
      
      <div 
        style={isMobile ? scrollFadeStyles : undefined}
        className={`${isMobile ? 'transition-all duration-300' : ''}`}
      >
        <Header showControls={true} toggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className={`flex-1 overflow-auto ${isMobile ? 'pt-10' : ''}`}>
          {!isMobile && <BreadcrumbBar />}
          
          <div className="max-w-full mx-auto p-4 pb-16 md:pb-4">
            <div 
              className="w-full mb-2"
              style={isMobile ? scrollFadeStyles : undefined}
            >
              <WelcomeCard 
                title="Dashboard" 
                description="Mova e edite os cards para personalizar a sua tela!" 
                icon={<Home className="h-6 w-6 mr-2" />} 
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
                greeting={true}
              />
            </div>
            
            <div 
              className="flex justify-end mb-4"
              style={isMobile ? scrollFadeStyles : undefined}
            >
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
            
            <div 
              className={`relative ${isMobile ? 'pb-32' : ''}`} 
              style={{
                height: isMobile ? "auto" : "calc(100vh - 300px)",
                minHeight: isMobile ? "auto" : "500px"
              }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : cards && cards.length > 0 ? (
                <div className="h-full w-full pr-2">
                  <div className="pb-4 px-2 py-2">
                    <CardGridContainer 
                      cards={cards.filter(card => !card.isHidden)} 
                      onCardsChange={handleCardsReorder}
                      onEditCard={handleCardEdit}
                      onHideCard={handleCardHide}
                      isMobileView={isMobile}
                      isEditMode={isEditMode}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum card disponível.
                </div>
              )}
            </div>
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
