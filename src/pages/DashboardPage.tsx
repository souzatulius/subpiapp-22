
import React, { useState } from 'react';
import { Home, RotateCcw } from 'lucide-react';
import { useDashboardCards } from '@/hooks/dashboard/useDashboardCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditCardModal from '@/components/dashboard/card-customization/EditCardModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActionCardItem } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

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
    firstName
  } = useUserData(user?.id);
  const {
    cards,
    isLoading,
    handleCardEdit: saveCardEdit,
    handleCardHide,
    handleCardsReorder,
    resetDashboard
  } = useDashboardCards();

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
      <Header showControls={true} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DashboardSidebar isOpen={sidebarOpen} />}
        
        <main className="flex-1 overflow-auto">
          <BreadcrumbBar />
          <div className="max-w-7xl mx-auto p-6 pb-16 md:pb-6">
            {/* WelcomeCard with updated description */}
            <div className="w-full mb-2">
              <WelcomeCard 
                title="Dashboard" 
                description="Mova e edite os cards para personalizar a sua tela!" 
                icon={<Home className="h-6 w-6 mr-2" />} 
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
                greeting={true}
              />
            </div>
            
            {/* Reset dashboard button with updated text */}
            <div className="flex justify-end mb-4">
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
            
            {/* Content container with better height calculation and scrolling behavior */}
            <div 
              className="relative" 
              style={{
                height: "calc(100vh - 300px)",
                minHeight: "500px"
              }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : cards && cards.length > 0 ? (
                <ScrollArea className="h-full w-full pr-4">
                  <div className="pb-4 px-[30px] py-[30px]">
                    <CardGridContainer 
                      cards={cards.filter(card => !card.isHidden)} 
                      onCardsChange={handleCardsReorder}
                      onEditCard={handleCardEdit}
                      onHideCard={handleCardHide}
                      isMobileView={isMobile}
                      isEditMode={isEditMode}
                    />
                  </div>
                </ScrollArea>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Nenhum card disponível.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Edit Card Modal */}
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
