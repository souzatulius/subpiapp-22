// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserData } from '@/hooks/dashboard/useUserData';
import { useAuth } from '@/hooks/useSupabaseAuth';
import Header from '@/components/layouts/Header';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import BreadcrumbBar from '@/components/layouts/BreadcrumbBar';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import EditCardModal from '@/components/dashboard/card-customization/EditCardModal';
import { ActionCardItem } from '@/types/dashboard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import useUserDashboardCards from '@/hooks/dashboard/useUserDashboardCards';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);

  // Utiliza o hook unificado para o dashboard padrão (departamento "default")
  const {
    cards,
    isLoading,
    isEditMode,
    toggleEditMode,
    handleCardEdit,
    handleCardHide,
    updateCardsOrder,
    isEditModalOpen,
    selectedCard,
    handleSaveCardEdit,
    setIsEditModalOpen
  } = useUserDashboardCards(user, 'default');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSaveCard = (updatedCard: Partial<ActionCardItem>) => {
    handleSaveCardEdit(updatedCard as ActionCardItem);
    setIsEditModalOpen(false);
    toast({
      title: "Card atualizado",
      description: "As alterações foram salvas com sucesso.",
      variant: "default",
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
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-16 md:pb-6">
            <div className="w-full mb-4">
              <WelcomeCard
                title="Dashboard"
                description="Bem-vindo ao seu dashboard personalizado."
                icon={<Home className="h-6 w-6 mr-2" />}
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
              />
            </div>
            <div className="relative" style={{ minHeight: "500px" }}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                cards && cards.length > 0 ? (
                  <ScrollArea className="h-full w-full pr-4">
                    <div className="pb-4">
                      <CardGridContainer 
                        cards={cards.filter(card => !card.isHidden)}
                        onCardsChange={updateCardsOrder}
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
                )
              )}
            </div>
          </div>
        </main>
      </div>
      {selectedCard && (
        <EditCardModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCard}
          card={selectedCard}
        />
      )}
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default DashboardPage;
