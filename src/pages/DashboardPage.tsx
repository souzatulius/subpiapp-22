
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { useUserData } from '@/hooks/useUserData';
import EditCardModal from '@/components/dashboard/EditCardModal';
import EditModeToggle from '@/components/dashboard/EditModeToggle';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import CardGridContainer from '@/components/dashboard/CardGridContainer';
import { useDashboardInicial } from '@/hooks/dashboard/useDashboardInicial';
import { Skeleton } from '@/components/ui/skeleton';
import { Home } from 'lucide-react';
import WelcomeMessage from '@/components/dashboard/WelcomeMessage';

interface DashboardPageProps {
  isPreview?: boolean;
  department?: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  isPreview = false, 
  department 
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
    handleCardEdit,
    handleCardHide,
    toggleEditMode,
    handleSaveCardEdit,
    setIsEditModalOpen
  } = useDashboardInicial(user, isPreview, department);

  if (!isPreview && !user) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4">
      <div className="w-full">
        <WelcomeCard
          title="Dashboard Inicial"
          description="Acompanhe seus principais indicadores"
          icon={<Home className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
          userName={firstName}
        />
      </div>
      
      <WelcomeMessage />
      
      {!isLoading && <EditModeToggle isEditMode={isEditMode} onToggle={toggleEditMode} />}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        cards.length > 0 ? (
          <CardGridContainer
            cards={cards}
            onCardsChange={cards => cards}
            onEditCard={handleCardEdit}
            onHideCard={handleCardHide}
            isMobileView={isMobile}
            isEditMode={isEditMode}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
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

export default DashboardPage;
