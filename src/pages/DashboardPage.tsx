
import React, { useState } from 'react';
import { Home } from 'lucide-react';
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

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ActionCardItem | null>(null);
  
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { firstName } = useUserData(user?.id);
  const { cards, isLoading, handleCardEdit: saveCardEdit, handleCardHide } = useDashboardCards();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
          <div className="max-w-7xl mx-auto p-6 pb-20 md:pb-6">
            {/* WelcomeCard takes full width */}
            <div className="w-full mb-8">
              <WelcomeCard
                title="Dashboard"
                description="Bem-vindo ao seu dashboard personalizado."
                icon={<Home className="h-6 w-6 mr-2" />}
                color="bg-gradient-to-r from-blue-800 to-blue-950"
                userName={firstName}
              />
            </div>
            
            {/* Content container with better height calculation and scrolling behavior */}
            <div className="relative" style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                cards && cards.length > 0 ? (
                  <ScrollArea className="h-full w-full pr-4">
                    <div className="pb-8">
                      <CardGridContainer 
                        cards={cards.filter(card => !card.isHidden)}
                        onCardsChange={() => {}}
                        onEditCard={handleCardEdit}
                        onHideCard={handleCardHide}
                        isMobileView={isMobile}
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
